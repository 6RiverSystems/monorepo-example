// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from 'ngx-logger';
import { MapCoreConfig } from '@sixriver/map-core';

export const environment = {
	production: false,
	mapCoreConfig: <MapCoreConfig>{
		logLevel: NgxLoggerLevel.TRACE,
		socket: {
			baseUrl: 'http://localhost:3003',
			config: {
				path: '/socket.io/',
			},
		},
		taskCoordinatorBaseUrl: 'http://localhost:3001',
		assetManagerBaseUrl: 'http://localhost:3002',
		storagePath: window.location.origin,
		mapManagerBaseUrl: 'http://localhost:3003',
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
