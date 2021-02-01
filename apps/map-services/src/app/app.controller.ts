import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SaveRequestParams } from './messages/message.dto';
import { AppService } from './app.service';
import { get } from 'http';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	saveMap(@Body() message: SaveRequestParams) {
		return this.appService.saveMap(message.mapName, message.mapJson);
	}

	@Get('sites')
	getConfigurations() {
		return this.appService.getConfiguration(null);
	}

	@Get('sites/:siteId?')
	getConfiguration(@Param('siteId') siteId: string) {
		return this.appService.getConfiguration(siteId);
	}

	@Get(':id')
	getData(@Param('id') id: string) {
		return this.appService.getData(id);
	}
}
