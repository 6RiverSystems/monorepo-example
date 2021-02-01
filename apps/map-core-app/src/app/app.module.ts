import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MaterialModule } from '@sixriver/map-core';
import {
	MapCoreModule,
	MapStorageManagerService,
	MapStorageService,
	MAP_CORE_CONFIG,
} from '@sixriver/map-core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppEffectsModule } from './app-effects.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		MaterialModule,
		AppEffectsModule,
		BrowserAnimationsModule,
		BrowserModule,
		LoggerModule.forRoot({
			level: environment.mapCoreConfig.logLevel,
			serverLogLevel: NgxLoggerLevel.OFF,
		}),
		MapCoreModule,
	],
	providers: [
		{
			provide: MAP_CORE_CONFIG,
			useValue: new BehaviorSubject(environment.mapCoreConfig),
		},
		{ provide: MapStorageService, useClass: MapStorageManagerService },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
