import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { mapCoreReducers, mapCoreMetaReducers } from './reducers';
import { MAP_CORE_CONFIG, MapCoreConfig } from './interfaces/config';
import { MapStackService } from './services/map-stack.service';
import { MapStackStateService } from './services/map-stack-state.service';
import { MaterialModule } from './material.module';
import { MfpsService } from './services/mfps.service';
import { MfpWorkflowService } from './services/mfp-work.service';
import { MfpsLogDnaService } from './services/mfps-log-dna.service';
import { MapStorageService } from './services/storage/map-storage.service';
import { MapStorageMockService } from './services/storage/map-storage-mock.service';
import { DetailModule } from './detail/detail.module';
import { SiteService } from './services/site.service';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './services/notification.service';
import { SpinnerModule } from './spinner/spinner.module';

const mapCoreConfig: MapCoreConfig = {
	logLevel: NgxLoggerLevel.OFF,
	socket: {
		baseUrl: 'http://localhost:3003',
		config: {},
	},
	storagePath: 'http://localhost:3003/',
	assetManagerBaseUrl: '/cfs/asset-manager',
	taskCoordinatorBaseUrl: '/cfs/task-coordinator',
	pathPlannerBaseUrl: `${window.location.origin}/generate`,
	historicalView: false,
	googleClientId: '1038937363641-utj1v1krkcb30do8m8igbdlbdememe5l.apps.googleusercontent.com',
	mapManagerBaseUrl: 'http://localhost:3003',
};

@NgModule({
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		HttpClientModule,
		LoggerModule.forRoot({
			level: NgxLoggerLevel.OFF,
			serverLogLevel: NgxLoggerLevel.OFF,
		}),
		MaterialModule,
		ReactiveFormsModule,
		RouterModule,
		RouterTestingModule,
		DetailModule,
		SpinnerModule,
		StoreModule.forRoot(mapCoreReducers, {
			metaReducers: mapCoreMetaReducers,
			runtimeChecks: {
				strictStateImmutability: false,
				strictActionImmutability: false,
			},
		}),
		EffectsModule.forRoot([]),
	],
	exports: [
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		LoggerModule,
		MaterialModule,
		ReactiveFormsModule,
		RouterModule,
		RouterTestingModule,
		DetailModule,
		SpinnerModule,
		StoreModule,
	],
	providers: [
		{
			provide: MAP_CORE_CONFIG,
			useValue: new BehaviorSubject<MapCoreConfig>(mapCoreConfig),
		},
		{ provide: MapStorageService, useClass: MapStorageMockService },
		NGXLogger,
		MapStackService,
		MapStackStateService,
		NotificationService,
		MfpsLogDnaService,
		MfpsService,
		MfpWorkflowService,
		SiteService,
	],
	declarations: [NotificationComponent],
	entryComponents: [NotificationComponent],
})
export class TestModule {}
