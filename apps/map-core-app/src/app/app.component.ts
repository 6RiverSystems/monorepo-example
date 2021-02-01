import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
	MapCoreState,
	MapStackService,
	MapStackStateService,
	MapStack,
	FetchMapStack,
	NotificationService,
	MfpsListen,
	MfpsListenWork,
	UsersListen,
	DisplayOptions,
	DisplayOptionsService,
	WorkflowPointsListen,
} from '@sixriver/map-core';

/**
 *  AppComponent is a fixture used only for developing and testing map-core.
 */
@Component({
	selector: 'map-core-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	public mapStackInitialized = false;
	private ngUnsubscribe = new Subject();

	constructor(
		private store: Store<MapCoreState>,
		public mapStackStateService: MapStackStateService,
		public mapStackService: MapStackService,
		public notificationService: NotificationService,
		public displayOptionsService: DisplayOptionsService,
	) {
		const urlParams = new URLSearchParams(window.location.search);
		const testMode = urlParams.get('test') || false;

		this.displayOptionsService.selectPreset('editorOptions');
		this.displayOptionsService.setOption(DisplayOptions.NextMode, !testMode);
	}

	ngOnInit() {
		// the url parameters come from the e2e protractor setup.
		const urlParams = new URLSearchParams(window.location.search);
		const mapName = urlParams.get('mapName') || 'xpomem';
		const testMode = urlParams.get('test') || false;

		if (this.displayOptionsService.get(DisplayOptions.MfpDisplay)) {
			this.store.dispatch(new MfpsListen());
			this.store.dispatch(new MfpsListenWork());
			this.store.dispatch(new UsersListen());
			this.store.dispatch(new WorkflowPointsListen());
		}

		// Using /map.6rms assumes that MapStorageManagerService is being used
		this.store.dispatch(new FetchMapStack({ fileName: `${mapName}.6rms`, generation: null }));
		// once MapStack is retrieved, navigate to SiteComponent
		this.mapStackStateService.mapStack$
			.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
			.subscribe((mapStack: MapStack) => {
				if (mapStack) {
					this.mapStackInitialized = true;
					if (!testMode) {
						this.notificationService.showNotification(
							'Loaded map stack successfully',
							'success',
							3000,
						);
					}
				}
			});
	}
}
