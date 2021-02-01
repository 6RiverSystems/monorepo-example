// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const { constants } = require('karma');

const reporters = ['mocha'];

if (process.env.CI === 'true') {
	reporters.push('junit');
}

const getBaseKarmaConfig = () => {
	return {
		basePath: '',
		frameworks: ['mocha', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-mocha'),
			require('karma-chrome-launcher'),
			require('karma-firefox-launcher'),
			require('karma-mocha-reporter'),
			require('karma-junit-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma'),
		],
		client: {
			mocha: {
				// change Karma's debug.html to the mocha web reporter
				reporter: 'html',
				timeout: 5000,
			},
		},
		reporters,
		junitReporter: {
			outputDir: join(__dirname, './reports/karma'),
			outputFile: 'results.xml',
			useBrowserName: false,
		},
		coverageIstanbulReporter: {
			dir: join(__dirname, '../../coverage'),
			reports: ['html', 'lcovonly'],
			fixWebpackSourcePaths: true,
		},
		mochaReporter: {
			showDiff: true,
		},
		// Uncomment to report duration of every test
		// reportSlowerThan: 0.0001,
		port: 9876,
		colors: true,
		logLevel: constants.LOG_INFO,
		autoWatch: true,
		browsers: ['ChromeHeadless', 'FirefoxHeadless'],
		customLaunchers: {
			ChromeHeadlessUserData: {
				base: 'ChromeHeadless',
				chromeDataDir: process.env.KARMA_CHROME_USER_DATA_DIR,
			},
		},
		singleRun: true,
	};
};

/**
 * Build a Karma configuration for a project within the repository.
 * @example <caption>`karma.conf.js` for library "foo"</caption>
 * module.exports = config => buildProjectConfig(config, 'foo', 'libs');
 * @param config Karma configuration.
 * @param {string} name Name of project.
 * @param {string} [dir=''] Directory (relative to root of repository) that project is located in.
 * @returns Karma configuration.
 */
const buildProjectConfig = (config, name, dir = '') => {
	const baseConfig = getBaseKarmaConfig();
	config.set({
		...baseConfig,
		junitReporter: {
			...baseConfig.junitReporter,
			outputFile: `${name}.xml`,
		},
		coverageIstanbulReporter: {
			...baseConfig.coverageIstanbulReporter,
			dir: join(__dirname, 'coverage', dir, name),
		},
	});
};

// This default export is probably unused, but Karma configs are supposed to export a function
module.exports = getBaseKarmaConfig;
module.exports.buildProjectConfig = buildProjectConfig;
