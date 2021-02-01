import { Observable, merge, BehaviorSubject, Subscription, fromEvent, from } from 'rxjs';
import { map, filter, mergeMap, pluck } from 'rxjs/operators';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';

import { MAP_CORE_CONFIG, MapCoreConfig } from '../interfaces/config';
import { User } from '../interfaces/user';
import { MapCoreState } from '../reducers';
import { UsersListen } from '../users/users.actions';

@Injectable()
export class UsersService implements OnDestroy {
	private currentAssetManagerUrl: string;
	private configSubscription: Subscription;

	constructor(
		private log: NGXLogger,
		private store: Store<MapCoreState>,
		private http: HttpClient,
		@Inject(MAP_CORE_CONFIG) private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {
		this.configSubscription = mapCoreConfig.subscribe(config => {
			if (this.currentAssetManagerUrl !== config.assetManagerBaseUrl) {
				this.currentAssetManagerUrl = config.assetManagerBaseUrl;
				this.store.dispatch(new UsersListen());
			}
		});
	}

	ngOnDestroy(): void {
		this.configSubscription.unsubscribe();
	}

	observeStream(): Observable<User> {
		return fromEvent(
			new EventSource(
				`${this.mapCoreConfig.getValue().assetManagerBaseUrl}/v1/Users/change-stream`,
			),
			'data',
		).pipe(
			map((message: MessageEvent) => JSON.parse(message.data)),
			filter((update: any) => update.modelName === 'User'),
			pluck('data'),
		);
	}

	getUsers(): Observable<User> {
		return merge(
			this.http
				.get<Array<User>>(`${this.mapCoreConfig.getValue().assetManagerBaseUrl}/v1/Users`)
				.pipe(mergeMap((users: Array<User>) => from(users))),
			this.observeStream(),
		).pipe(map((user: User) => new User({ ...user })));
	}
}
