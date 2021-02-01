import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Observable, BehaviorSubject } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { combineUrls } from '@sixriver/url-fns';

import { MAP_CORE_CONFIG, MapCoreConfig } from '../../interfaces/config';
import { MapStorageService } from './map-storage.service';
import { MapStackMeta } from '../../interfaces/map-stack-meta';
import { MapCoreError } from '../../interfaces/map-core-error';

@Injectable()
export class MapStorageManagerService implements MapStorageService {
	constructor(
		private log: NGXLogger,
		private http: HttpClient,
		@Inject(MAP_CORE_CONFIG)
		private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {}

	loadFile(mapStackMeta?: MapStackMeta): Observable<Blob | {}> {
		let fileName = 'map.6rms';
		if (mapStackMeta && mapStackMeta.fileName) {
			fileName = mapStackMeta.fileName;
		}
		const mapStackUri: string = combineUrls(this.mapCoreConfig.getValue().storagePath, fileName);
		return this.http
			.get(mapStackUri, { responseType: 'blob' })
			.pipe(retry(2), catchError(this.handleError.bind(this)));
	}

	async saveFile(file: string, blob: Blob): Promise<boolean> {
		return false;
	}

	getMapStackVersionData(): any {
		// NOOP
	}

	setMapStackMeta(mapstackMeta: MapStackMeta) {
		// NOOP
	}

	private handleError(error: HttpErrorResponse) {
		const prefix = '[MapStorageManagerService]';
		if (error.error instanceof ErrorEvent) {
			this.log.error(`${prefix} an error occurred:`, error.error.message);
		} else {
			this.log.error(`${prefix} backend returned code ${error.name}, body was: ${error.message}`);
		}

		if (this.mapCoreConfig.getValue().storagePath === undefined) {
			return throwError(new MapCoreError('GRM Configuration has no Map Manager defined', error));
		} else if (error.status === 401) {
			return throwError(
				new MapCoreError(
					'Could not load map because password-protected Map Managers are not supported',
					error,
				),
			);
		} else {
			return throwError(new MapCoreError('Failed to load the map', error));
		}
	}
}
