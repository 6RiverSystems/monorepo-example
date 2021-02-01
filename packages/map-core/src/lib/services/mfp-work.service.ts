import { Observable, merge, BehaviorSubject, Subscription, fromEvent, from } from 'rxjs';
import { map, filter, mergeMap, pluck } from 'rxjs/operators';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { IAvMfpData } from '@sixriver/cfs_models';

import { MAP_CORE_CONFIG, MapCoreConfig } from '../interfaces/config';
import { MfpParams, Phase, WorkState } from '../interfaces/mfp';
import { MapCoreState } from '../reducers';
import { MfpsListenWork } from '../mfps/mfps.actions';

@Injectable()
export class MfpWorkflowService implements OnDestroy {
	private currentTaskCoordinatorUrl: string;
	private configSubscription: Subscription;

	constructor(
		private log: NGXLogger,
		private store: Store<MapCoreState>,
		private http: HttpClient,
		@Inject(MAP_CORE_CONFIG) private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {
		this.configSubscription = mapCoreConfig.subscribe(config => {
			if (this.currentTaskCoordinatorUrl !== config.taskCoordinatorBaseUrl) {
				this.currentTaskCoordinatorUrl = config.taskCoordinatorBaseUrl;
				this.store.dispatch(new MfpsListenWork());
			}
		});
	}

	ngOnDestroy(): void {
		this.configSubscription.unsubscribe();
	}

	/**
	 * Get realtime updates on the mfps states
	 */
	observeStream(): Observable<IAvMfpData> {
		return fromEvent(
			new EventSource(`${this.mapCoreConfig.getValue().taskCoordinatorBaseUrl}/v1/updates`),
			'message',
		).pipe(
			map((message: MessageEvent) => JSON.parse(message.data)),
			filter((update: any) => update.modelName === 'AvailableMfp'),
			pluck('data'),
		);
	}

	getWorkflow(): Observable<MfpParams> {
		const params = {
			filter: JSON.stringify({
				include: 'userTaskBatches',
			}),
		};
		return merge(
			this.http
				.get<Array<IAvMfpData>>(
					`${this.mapCoreConfig.getValue().taskCoordinatorBaseUrl}/v1/availableMfps`,
					{ params },
				)
				.pipe(mergeMap((mfps: Array<IAvMfpData>) => from(mfps))),
			this.observeStream(),
		).pipe(
			map(
				(mfp: IAvMfpData): MfpParams => {
					return {
						...mfp,
						phase: <Phase>mfp.phase,
						state: <WorkState>mfp.state,
					};
				},
			),
		);
	}
}
