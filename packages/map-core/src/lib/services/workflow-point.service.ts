import { Inject, Injectable, OnDestroy } from '@angular/core';
import { combineUrls } from '@sixriver/url-fns';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { MAP_CORE_CONFIG, MapCoreConfig } from '../interfaces/config';
import { WorkflowPointState } from '../interfaces/workflow-point-state';
import { FetchWorkflowPointError } from '../workflow-point/workflow-point.actions';

@Injectable()
export class WorkflowPointService {
	private mapManagerBaseUrl: string;

	constructor(
		private http: HttpClient,
		@Inject(MAP_CORE_CONFIG) private readonly mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {
		this.mapManagerBaseUrl = this.mapCoreConfig.getValue().mapManagerBaseUrl;
	}

	public getWorkflowPointState(
		name: string,
	): Observable<WorkflowPointState | FetchWorkflowPointError> {
		return this.http.get<WorkflowPointState>(`${this.getMapPointUrl()}/${name}`).pipe(
			retry(2),
			catchError((error: Error) => [new FetchWorkflowPointError(error)]),
		);
	}

	public getWorkflowPointStates() {
		return this.http.get<Array<WorkflowPointState>>(this.getMapPointUrl()).pipe(
			retry(2),
			catchError((error: Error) => [new FetchWorkflowPointError(error)]),
		);
	}

	public observeStream(): Observable<WorkflowPointState | FetchWorkflowPointError> {
		return fromEvent(
			new EventSource(
				`${
					this.mapCoreConfig.getValue().mapManagerBaseUrl
				}/v1/MapPointConfigOverrides/change-stream`,
			),
			'data',
		).pipe(
			map((message: MessageEvent) => {
				const { mapPointName, enabled, maxReservationCount } = JSON.parse(message.data).data;
				return { mapPointName, enabled, maxReservationCount };
			}),
			catchError((error: Error) => [new FetchWorkflowPointError(error)]),
		);
	}

	private getMapPointUrl(): string {
		return combineUrls(this.mapManagerBaseUrl, '/v1/MapPointConfigs');
	}

	private getMapPointStreamUrl(): string {
		return combineUrls(this.mapManagerBaseUrl, '/v1/MapPointConfigOverrides/change-stream');
	}
}
