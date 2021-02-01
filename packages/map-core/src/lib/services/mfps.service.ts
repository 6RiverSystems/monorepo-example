import { Injectable, Inject, OnDestroy } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { Store } from '@ngrx/store';
import { FaultState, FaultResolution } from '@sixriver/mfp_lib_js/browser';

import { MAP_CORE_CONFIG, MapCoreConfig } from '../interfaces/config';
import { MfpParams, FieldUpdatedMap } from '../interfaces/mfp';
import { SerializedMfp } from '../interfaces/serialized-mfp';
import { MapCoreState } from '../reducers';
import { MfpsListen } from '../mfps/mfps.actions';
import { fromEntries } from '../utils';

@Injectable()
export class MfpsService implements OnDestroy {
	private socket: SocketIOClient.Socket;
	private currentSocketUrl: string;
	private configSubscription: Subscription;

	connected$ = new BehaviorSubject<boolean>(false);

	constructor(
		@Inject(MAP_CORE_CONFIG) private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
		private log: NGXLogger,
		private store: Store<MapCoreState>,
	) {
		this.configSubscription = mapCoreConfig.subscribe(config => {
			if (this.currentSocketUrl !== config.socket.baseUrl) {
				this.currentSocketUrl = config.socket.baseUrl;
				this.store.dispatch(new MfpsListen());
			}
		});
	}

	ngOnDestroy(): void {
		this.configSubscription.unsubscribe();
	}

	disconnect() {
		this.socket.disconnect();
		this.connected$.next(false);
	}

	/**
	 * temporary patch to map faultCodes to faults field.
	 * 'faults' is deprecated in favor of 'faultCodes', because it represents faults serialized as numbers
	 * and would frequently get out of sync when the Fault code enum changed.
	 */
	transformLegacyFaults(data: any) {
		if (data.faultCodes) {
			// modern faults:
			return data.faultCodes;
		} else if (data.faults) {
			// convert legacy faults to modern faults:
			const legacyFaults = fromEntries(data.faults);
			const faults = {};
			Object.values(legacyFaults).map(({ code, resolution, timestamp, id }) => {
				const faultCode = Object.keys(FaultState)[code];
				const resolutionCode = Object.keys(FaultResolution)[resolution];
				faults[faultCode] = { code: faultCode, resolution: resolutionCode, timestamp, id };
			});
			return faults;
		}
		return {};
	}

	listen(): Observable<any> {
		if (this.socket) {
			this.disconnect();
		}
		this.socket = SocketIOClient.connect(
			this.mapCoreConfig.getValue().socket.baseUrl,
			this.mapCoreConfig.getValue().socket.config,
		);
		this.socket.on('connect', () => this.connected$.next(true));
		this.socket.on('disconnect', () => this.connected$.next(false));
		this.socket.on('connect_failed', () => {});
		this.socket.on('connect_error', () => {});
		this.socket.on('reconnect_failed', () => {});
		this.socket.on('reconnect_error', () => {});
		this.socket.on('error', () => {});

		const message = 'message';
		return new Observable(observer => {
			this.socket.on(message, (response: SerializedMfp) => {
				try {
					const mfp: MfpParams = {
						...response.data,
						id: response.data.name,
						faults: this.transformLegacyFaults(response.data),
						fieldUpdated: fromEntries(response.data.fieldUpdated as any) as FieldUpdatedMap,
						updated: new Date(response.data.updated),
					};
					observer.next(mfp);
				} catch (e) {
					this.log.error(`This doesn't look like a valid JSON: ${response}`);
				}
			});

			return () => this.socket.off(message);
		});
	}
}
