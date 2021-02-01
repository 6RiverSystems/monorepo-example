/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { AppController } from './app/app.controller';
import packageJson from '../package.json';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);
	const port = process.env.PORT || 3009;

	const options = new DocumentBuilder()
		.setTitle('Map Services')
		.setVersion(packageJson.version)
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('explorer', app, document);

	await app.listen(port, () => {
		Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
	});
}

bootstrap();
