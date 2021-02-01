import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { filter, pluck, take, tap } from 'rxjs/operators';
import { ValidationError } from '@sixriver/map-validator';

import { MapCoreState } from '../reducers';
import { MapStackState } from '../map-stack/map-stack.reducer';
import { MapStack } from '../class/mapstack/MapStack';
import { MAP_CORE_CONFIG, MapCoreConfig } from '../interfaces/config';
import { MapCoreError } from '../interfaces/map-core-error';
import { MapFeature } from '../interfaces/feature';
import { MapStackService } from './map-stack.service';
import { MapStackSerializer } from '../class/serialize/MapStackSerializer';
import { FetchMapStack, ValidateMapStack } from '../map-stack/map-stack.actions';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';
import { WorkflowPointState } from '../interfaces/workflow-point-state';
import { DisplayOptionsService } from './display-options.service';
import { DisplayOptions } from '../interfaces/map-display-options';
import { FetchAllWorkflowPoints } from '../workflow-point/workflow-point.actions';
import { NotificationService } from './notification.service';

declare global {
	interface Window {
		mapStackState: MapStackSerializer;
	}
}

/**
 * Manage state of a map stack instance that can be shared between several components.
 */
@Injectable()
export class MapStackStateService implements OnDestroy {
	[x: string]: any;
	public mapStack$: Observable<MapStack>;
	private _mapStack: MapStack;
	private currentMap: string;
	public newMapStackCreated: boolean;
	private configSubscription: Subscription;
	private liveValidation = true;

	constructor(
		private log: NGXLogger,
		private store: Store<MapCoreState>,
		private mapStackService: MapStackService,
		private displayOptionsService: DisplayOptionsService,
		public notificationService: NotificationService,

		@Inject(MAP_CORE_CONFIG) private mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {
		this.mapStack$ = this.store.pipe(
			select('mapStack'),
			pluck<MapStackState, MapStack>('mapStack'),
			// Only take non-null map stacks
			filter((mapStack: MapStackState['mapStack']) => mapStack !== null),
		);

		// Subscribe to the map stack
		this.mapStack$.subscribe((mapStack: MapStack) => {
			this._mapStack = mapStack;
			this.updateGlobalMapStack();
		});

		this.displayOptionsService
			.getOption$(DisplayOptions.WorkflowStatusToggleEnabled)
			.pipe(tap(() => this.store.dispatch(new FetchAllWorkflowPoints())));

		this.configSubscription = mapCoreConfig.subscribe(config => {
			if (this.currentMap !== config.storagePath) {
				this.currentMap = config.storagePath;
				this.store.dispatch(new FetchMapStack());
			}
		});
	}

	ngOnDestroy(): void {
		this.configSubscription.unsubscribe();
	}

	/**
	 * Get the map stack, waiting for it if necessary
	 * Only the first mapstack will be returned by this method
	 */
	public async getMapStack(): Promise<MapStack> {
		await this.mapStack$.pipe(take(1)).toPromise();
		return this._mapStack;
	}

	/**
	 * Edit a map layer
	 * @param layer A map layer
	 */
	public edit(layers: MapFeature[]): void {
		layers.forEach(layer => {
			this.log.debug('[MapStackStateService] edit', { layer: layer.id, mapStack: this._mapStack });
			const actualLayer = this.findLayer(layer.id);
			this.log.debug('[MapStackStateService] actual layer', { actualLayer: actualLayer.id });
			actualLayer.copyFromLayer(layer);
			actualLayer.refresh();
		});

		// Update the corresponding layer in the map with the new data
		this.updateGlobalMapStack();

		if (this.liveValidation) {
			this.store.dispatch(new ValidateMapStack(this._mapStack));
		}
		const message = layers.length > 1 ? `${layers.length} Features updated` : `Feature updated`;
		this.notificationService.showNotification(message, 'success', 3000);
	}

	/**
	 * Saves the current state of the map
	 */
	public saveMap(): Promise<boolean> {
		this.log.trace('[MapStackStateService] saving map', { mapStack: this._mapStack });
		if (!this._mapStack) {
			throw new MapCoreError('cannot save, missing Map Stack');
		}
		return this.mapStackService.saveMapStack(this._mapStack.baseFileName, this._mapStack);
	}

	/**
	 * Saves the current state of the map to disk
	 */
	public generateMapStack(): Promise<Blob> {
		if (!this._mapStack) {
			throw new MapCoreError('cannot save, missing Map Stack');
		}
		return this.mapStackService.generateMapStack(this._mapStack);
	}

	/**
	 * Saves the current state of the map to disk
	 */
	public saveLocalMap(): Promise<boolean> {
		if (!this._mapStack) {
			throw new MapCoreError('cannot save, missing Map Stack');
		}

		return this.mapStackService.saveLocalMapStack(this._mapStack.baseFileName, this._mapStack);
	}

	public validateMapStack(): Promise<[boolean, ValidationError[]]> {
		if (!this._mapStack) {
			throw new MapCoreError('cannot validate, missing Map Stack');
		}

		return this.mapStackService.validateMapStack(this._mapStack);
	}

	/**
	 * Remove a map layer
	 * @param layer A map layer
	 */
	public remove(layer: MapFeature): void {
		const actualLayer = this.findLayer(layer.id);
		this.log.debug('[MapStackStateService] remove', { actualLayer, mapStack: this._mapStack });
		this._mapStack.removeLayer(actualLayer);

		this.updateGlobalMapStack();

		if (this.liveValidation) {
			this.store.dispatch(new ValidateMapStack(this._mapStack));
		}
	}

	/**
	 * Find a layer in the map stack by its ID
	 * @param layer A map layer
	 */
	public findLayer(layerId: string): MapFeature {
		const result: MapFeature = this._mapStack.findLayer(layerId);
		if (!result) {
			throw new MapCoreError('could not find actual layer');
		}
		return result;
	}

	async updateWorkflowPointState(
		workflowPointState: WorkflowPointState,
	): Promise<WorkflowPointState> {
		const isWorkflowPointToggleEnabled = await this.displayOptionsService
			.getOption$(DisplayOptions.WorkflowStatusToggleEnabled)
			.pipe(take(1))
			.toPromise();
		if (isWorkflowPointToggleEnabled) {
			const mapStack = await this.getMapStack();
			const newLayers = <WorkflowPoint[]>mapStack.workflowPoints.getLayers();
			if (workflowPointState && workflowPointState.hasOwnProperty('enabled') && newLayers) {
				newLayers.forEach(layer => {
					if (workflowPointState.mapPointName === layer.name) {
						layer.updateEnabledState(workflowPointState);
					}
				});
			}
			return workflowPointState;
		}
	}

	/**
	 * Creates and updates a globally accessible serialized MapStack. Use this method within
	 * functions that edit/update the state of this._mapStack to serialize it
	 * to the window.
	 *
	 * @example
	 * edit(layer: MapFeature) {
	 * 		// Edit map stack...
	 *
	 * 		this.updateGlobalMapStack();
	 * }
	 */
	private updateGlobalMapStack() {
		if (this.mapCoreConfig.getValue().testMode) {
			window.mapStackState = MapStackSerializer.fromMapStack(this._mapStack);
		}
	}
}
