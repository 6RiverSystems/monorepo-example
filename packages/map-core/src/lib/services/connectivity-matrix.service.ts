import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ConnectivityMatrix } from '@sixriver/map-io';

import { MAP_CORE_CONFIG, MapCoreConfig } from '../interfaces/config';
import { MapCoreError } from '../interfaces/map-core-error';

@Injectable()
export class ConnectivityMatrixService {
	constructor(
		private log: NGXLogger,
		private http: HttpClient,
		@Inject(MAP_CORE_CONFIG) private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {}

	generateConnectivityMatrix(blob: Blob): Observable<ConnectivityMatrix> {
		const formData: FormData = new FormData();
		formData.append('mapStack', blob);

		return this.http
			.post(this.mapCoreConfig.getValue().pathPlannerBaseUrl + 'generate', formData)
			.pipe(map((res: any) => res.connectivity))
			.pipe(catchError(this.handleError.bind(this, 'Failed to save Map Stack')));
	}

	private handleError(msg: string, error: HttpErrorResponse) {
		const prefix = '[ConnectivityMatrixService]';
		if (error.error instanceof ErrorEvent) {
			this.log.error(`${prefix} an error occurred:`, error.error.message);
		} else {
			this.log.error(`${prefix} backend returned code ${error.name}, body was: ${error.message}`);
		}

		return throwError(new MapCoreError(msg, error));
	}
}
