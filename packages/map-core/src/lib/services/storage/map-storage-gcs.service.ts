import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { MapStorageService } from './map-storage.service';
import { MapStackMeta } from '../../interfaces/map-stack-meta';
import { MapStackVersionData } from '../../interfaces/map-stack-version-data';
import { MAP_CORE_CONFIG, MapCoreConfig } from '../../interfaces/config';
import { MapCoreError } from '../../interfaces/map-core-error';
import { pathBasename } from '../../utils';

@Injectable()
export class MapStorageGoogleCloudService implements MapStorageService {
	private baseUrl: string;
	private uploadUrl: string;
	public mapStackMeta: MapStackMeta;

	constructor(
		private http: HttpClient,
		private log: NGXLogger,
		@Inject(MAP_CORE_CONFIG) private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {
		const bucket = this.useStagingBucket() ? 'site-layouts-staging' : 'site-layouts';

		this.baseUrl = `${this.mapCoreConfig.getValue().googleCloudStorageBaseUrl}${bucket}/o/`;
		this.uploadUrl = `${this.mapCoreConfig.getValue().googleCloudStorageUploadBaseUrl}${bucket}/o/`;
	}

	useStagingBucket(): boolean {
		return (
			window.location.origin.indexOf('localhost') !== -1 ||
			window.location.origin.indexOf('-staging') !== -1
		);
	}

	loadFile(mapStackMeta: MapStackMeta): Observable<Blob | {}> {
		this.setMapStackMeta(mapStackMeta);

		let mapStackUri = `${this.baseUrl}${encodeURIComponent(
			this.mapStackMeta.fileName,
		)}.6rms?alt=media`;

		this.log.info(`mapStackUri: ${mapStackUri}`);

		if (this.mapStackMeta.generation) {
			mapStackUri += `&generation=${this.mapStackMeta.generation}`;
		}

		return this.http.get(mapStackUri, { observe: 'response', responseType: 'blob' }).pipe(
			map((response: HttpResponse<Blob>) => {
				this.mapStackMeta.generation = response.headers.get('x-goog-generation');
				return response.body;
			}),
			retry(2),
			catchError(
				this.handleError.bind(this, `Failed to load Map Stack for site: ${mapStackMeta.fileName}`),
			),
		);
	}

	saveFile(file: string, blob: Blob): Promise<boolean> {
		const mapStackUploadUri: string = this.uploadUrl;

		const params: any = {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Length': blob.size,
			},
			params: {
				uploadType: 'media',
				name: `${file}.6rms`,
			},
		};

		return this.http
			.post(mapStackUploadUri, blob, params)
			.pipe(catchError(this.handleError.bind(this, 'Failed to save Map Stack')))
			.toPromise()
			.then((res: any) => {
				this.mapStackMeta.generation = res.generation;
				this.log.info(`Saved map file ${file} generation=${this.mapStackMeta.generation}`, res);
				return res;
			});
	}

	private handleError(msg: string, error: HttpErrorResponse) {
		const prefix = '[MapStorageGoogleCloudService]';
		if (error.error instanceof ErrorEvent) {
			this.log.error(`${prefix} an error occurred:`, error.error.message);
		} else {
			this.log.error(`${prefix} backend returned code ${error.name}, body was: ${error.message}`);
		}

		// Clear map stack metadata if a MapStack failed to load from GCS
		this.mapStackMeta = null;

		throw new MapCoreError(msg, error);
	}

	/**
	 * Retrieve MapStack version data from Google Cloud Storage.
	 *
	 * Must set this.mapStackMeta via this.setMapStackMeta(mapStackMeta: MapStackMeta) prior to calling this function.
	 */
	getMapStackVersionData(): Promise<MapStackVersionData> {
		if (!this.mapStackMeta) {
			throw new MapCoreError(`You must call setMapStackMeta(mapStackMeta: MapStackMeta)
				prior to this function for newly created maps`);
		}

		// URI to file metadata
		const mapStackDownloadUri = `${this.baseUrl}${encodeURIComponent(
			this.mapStackMeta.fileName,
		)}.6rms`;

		return this.http
			.get(mapStackDownloadUri)
			.pipe(retry(2), catchError(this.handleError.bind(this, 'Failed to load Map Stack versions')))
			.toPromise()
			.then((mostRecent: any) => {
				const siteName = pathBasename(mostRecent.name);

				if (this.mapStackMeta) {
					if (this.mapStackMeta.newMapStack) {
						this.mapStackMeta.fileName = siteName;
						this.mapStackMeta.generation = mostRecent.generation;
						this.mapStackMeta.newMapStack = false;
					}

					if (mostRecent.generation !== this.mapStackMeta.generation) {
						return {
							versionConflict: true,
							siteName,
							link: `/sites/${siteName}/${mostRecent.generation}`,
							timestamp: mostRecent.updated,
							generation: mostRecent.generation,
							currentGeneration: this.mapStackMeta.generation,
						};
					} else {
						return {
							currentGeneration: mostRecent.generation,
							siteName,
						};
					}
				} else {
					// Currently, this.mapStackMeta is only defined if the MapStack was pulled from GCS
					// If it was not pulled from GCS, then it is a newly created map
					this.mapStackMeta = {
						fileName: '',
						generation: '',
						newMapStack: true,
					};

					if (mostRecent.generation !== this.mapStackMeta.generation) {
						return {
							versionConflict: true,
							siteName,
							link: `/sites/${siteName}/${mostRecent.generation}`,
							timestamp: mostRecent.updated,
							generation: mostRecent.generation,
							currentGeneration: this.mapStackMeta.generation,
						};
					} else {
						return {
							currentGeneration: mostRecent.generation,
							siteName,
						};
					}
				}
			});
	}

	setMapStackMeta(mapStackMeta: MapStackMeta) {
		this.mapStackMeta = mapStackMeta;
	}
}
