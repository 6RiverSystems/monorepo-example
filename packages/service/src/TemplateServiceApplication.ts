/* istanbul ignore next */ // ignore boilerplate enabling instrumentation in prod
if (process.env.NODE_ENV === 'production' && process.env.APM === 'true') {
	require('instana-nodejs-sensor')();
}

import * as _ from 'lodash';
import * as path from 'path';

import {ApplicationConfig, Provider, BindingScope} from '@loopback/core';
import {RestApplication, RestServer, RestBindings} from '@loopback/rest';
import {Constructor, inject, Getter} from '@loopback/context';

import {RepositoryMixin, juggler} from '@loopback/repository';
import {BootMixin} from '@loopback/boot';

import {
	configureServiceConfig,
	ServiceConfig,
	getServiceConfigOptions,
	CommonBindings,
	LoggingConfigOptions,
	getDefaultLoggingConfiguration,
	configureLogging,
	KillController,
	envRestOptions,
	UptimeController,
	bindPathAwareExplorer,
	JsonSchema4ValidatorProvider,
	BunyanMinimalLogFactoryProvider,
	InternalServiceDirectoryProvider,
	DbMigrateBooterBase,
} from '@sixriver/loopback4-support';
import {MinimalLogFactory, MinimalLogger} from '@sixriver/typescript-support';
import {ServicePortFactory, getEnvironment} from '@sixriver/service-directory';

import {TemplateMessage, TemplateMessageSchema} from '@sixriver/template-oas';

import {TemplateServiceProviderKeys} from './providers';

import {TemplateServiceSequence} from './TemplateServiceSequence';
import {TemplateDataSource} from './datasources';

const defaultListenHost = '0.0.0.0';

const defaultListenPort =
	new ServicePortFactory(() => console)
	.manufacture(getEnvironment(process.env))
	// FIXME: replace this with your service name and remove the `as any`
	.getPort('template-service' as any);

export type TemplateServiceApplicationArguments = {
	options?: ApplicationConfig,
	loggingOptions?: LoggingConfigOptions,
	serviceConfig?: Constructor<Provider<ServiceConfig>> | ServiceConfig,
	env?: NodeJS.ProcessEnv,
};

// eslint-disable-next-line 6river/new-cap
export class TemplateServiceApplication extends BootMixin(RepositoryMixin(RestApplication)) {
	private logger?: MinimalLogger;

	public constructor(args: TemplateServiceApplicationArguments) {
		if (!args.options) {
			args.options = {};
		}

		_.defaults(args.options, envRestOptions({
			rest: {
				host: defaultListenHost,
				port: defaultListenPort,
			},
		}));

		super(args.options);

		// Set up the custom sequence
		this.sequence(TemplateServiceSequence);

		this.projectRoot = __dirname;

		// NOTE: for unknown reasons, things seem to be a bit titchy about where exactly in the constructor we put this line
		// don't move it without verifying it works both locally on your dev machine AND in a cluster!
		bindPathAwareExplorer(this);

		// Customize @loopback/boot Booter Conventions here
		this.bootOptions = {
			controllers: {
				// Customize ControllerBooter Conventions here
				dirs: ['controllers'],
				extensions: ['.controller.js'],
				nested: true,
			},
			datasources: {
				dirs: ['datasources'],
				extensions: ['.datasource.js'],
				nested: true,
			},
			repositories: {
				dirs: ['repositories'],
				extensions: ['.repository.js'],
				nested: true,
			},
		};

		class DbMigrateBooter extends DbMigrateBooterBase {
			constructor(
				@inject(CommonBindings.LOG_FACTORY)
					loggerFactory: MinimalLogFactory,
				@inject.getter('datasources.' + TemplateDataSource.name)
					datasource: Getter<juggler.DataSource>
			) {
				super(loggerFactory, datasource, 'service', path.join(__dirname, '../../'));
			}
		}
		this.booters(DbMigrateBooter);

		// register dependencies

		if (!args.env) {
			args.env = process.env;
		}
		this.bind(CommonBindings.PROCESS_ENV).to(args.env);

		configureLogging(this, TemplateServiceApplication.getLoggingConfigOptions(args.loggingOptions));
		this.bind(CommonBindings.LOG_FACTORY)
		.toProvider(BunyanMinimalLogFactoryProvider)
		.inScope(BindingScope.SINGLETON);
		// TODO: not sure what's the right thing to do here for configuring dependencies... maybe "Component"s?
		// TODO: this is probably not right, LB4 config is not fully baked yet, for example:
		//		https://github.com/strongloop/loopback.io/issues/540)
		//		https://github.com/strongloop/loopback-next/issues/1054)
		configureServiceConfig(this, getServiceConfigOptions(), args.serviceConfig);

		// Add the standard controllers
		this.controller(KillController);
		this.controller(UptimeController);

		this.bind(TemplateServiceProviderKeys.SERVICE_DIRECTORY)
		.toProvider(InternalServiceDirectoryProvider)
		.inScope(BindingScope.SINGLETON);

		class TemplateMessageValidatorProvider extends JsonSchema4ValidatorProvider<TemplateMessage> {
			constructor(
				@inject(CommonBindings.LOG_FACTORY)
					logFactory: MinimalLogFactory,
			) {
				super(TemplateMessageSchema, 'TemplateMessage', logFactory);
			}
		}
		this.bind(TemplateServiceProviderKeys.REQUEST_VALIDATOR)
		// note: the JSON schema file doesn't get copied to dist, so have to lift ourselves out of `dist10/src`
		.toProvider(TemplateMessageValidatorProvider)
		.inScope(BindingScope.SINGLETON);
	}

	public async start() {
		this.bind(UptimeController.STARTED_TIME).to(new Date());

		const loggerFactory = await this.get(CommonBindings.LOG_FACTORY);
		this.logger = loggerFactory(TemplateServiceApplication.name);

		await super.start();

		const server = await this.getServer(RestServer);
		const port = await server.get(RestBindings.PORT);

		this.logger.info(`Server is running at http://127.0.0.1:${port}`);
		this.logger.info(`OpenApi spec: http://127.0.0.1:${port}/openapi.json`);
		this.logger.info(`API explorer: http://127.0.0.1:${port}/explorer`);
	}

	public static getLoggingConfigOptions(loggingConfigOptions?: LoggingConfigOptions): LoggingConfigOptions {
		loggingConfigOptions = loggingConfigOptions || {};
		// if a logger factory is given, we don't need the logger config
		if (!loggingConfigOptions.loggerFactory && !loggingConfigOptions.logging) {
			loggingConfigOptions.logging = getDefaultLoggingConfiguration('template-service');
		}
		return loggingConfigOptions;
	}
}
