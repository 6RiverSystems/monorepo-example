import { InjectionToken } from '@angular/core';
import { NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

export interface MapCoreConfig {
	logLevel: NgxLoggerLevel;

	/**
	 * Configuration for the Socket that live MFP data comes from
	 */
	socket: {
		/**
		 * Base URL of the Socket.IO server, must have a trailing slash
		 */
		baseUrl: string;

		// Had to hard-code the typings for ConnectOpts from SocketIOClient because of an ambient namespace problem
		config: {
			/**
			 * The path to get our client file from, in the case of the server
			 * serving it
			 * @default '/socket.io'
			 */
			path?: string;
		};
	};

	/**
	 * URL or bucket name to retrieve the map from (depending on which MapStorageService implementation is used), must
	 * have a trailing slash
	 */
	storagePath: string;

	/**
	 * Base URL of the Asset Manager, must have a trailing slash
	 */
	assetManagerBaseUrl: string;

	/**
	 * Base URL of the Task Coordinator, must have a trailing slash
	 */
	taskCoordinatorBaseUrl: string;

	/**
	 * Base URL of the Map Manager, must have a trailing slash
	 */
	mapManagerBaseUrl?: string;
	/**
	 * Base URL of the Path Planer, must have a trailing slash
	 */
	pathPlannerBaseUrl?: string;

	/**
	 * Whether to enable viewing of historical data or not
	 */
	historicalView: boolean;

	/**
	 * ID for Google Cloud Storage
	 */
	googleClientId: string;

	/**
	 * ID for Google Cloud Storage URL
	 */
	googleCloudStorageBaseUrl?: string;

	/**
	 * ID for Google Cloud Storage Upload URL
	 */
	googleCloudStorageUploadBaseUrl?: string;

	/**
	 * Flag for whether or not running in a test environment. If true, you can enable "testMode" functionality
	 * in various parts of the code.
	 *
	 * @example
	 * if (mapCoreConfig.testMode) {
	 * 		// do testing mode stuff
	 * }
	 */
	testMode?: boolean;
}

export const MAP_CORE_CONFIG = new InjectionToken<BehaviorSubject<MapCoreConfig>>('mapCoreConfig');
