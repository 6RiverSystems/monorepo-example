import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NGXLogger } from 'ngx-logger';
import { mergeMap, map, catchError, concatMap, mergeMapTo, take } from 'rxjs/operators';
import { ConnectivityMatrix } from '@sixriver/map-io';
import { Store } from '@ngrx/store';

import { MapStack } from '../class/mapstack/MapStack';
import {
	FetchMapStack,
	FetchMapStackComplete,
	FetchMapStackError,
	FetchLocalMapStack,
	FetchLocalMapStackComplete,
	FetchLocalMapStackError,
	SaveMapStackComplete,
	SaveMapStackError,
	SaveLocalMapStackComplete,
	SaveLocalMapStackError,
	MapStackActionTypes,
	GenerateConnectivityMatrixComplete,
	GenerateConnectivityMatrixError,
	ValidateMapStackComplete,
	ValidateMapStackError,
} from './map-stack.actions';
import { MapStackService } from '../services/map-stack.service';
import { MapStackStateService } from '../services/map-stack-state.service';
import { ConnectivityMatrixService } from '../services/connectivity-matrix.service';
import { FetchAllWorkflowPoints } from '../workflow-point/workflow-point.actions';
import { DisplayOptionsService } from '../services/display-options.service';
import { DisplayOptions } from '../interfaces/map-display-options';
import { MapCoreState } from '../reducers';

@Injectable()
export class MapStackEffects {
	@Effect()
	fetch$ = this.actions$.pipe(
		ofType(MapStackActionTypes.Fetch),
		mergeMap((action: FetchMapStack) =>
			this.mapStackService.loadMapStack(action.payload).pipe(
				mergeMap((mapStack: MapStack) => {
					const actions = <Array<FetchMapStackComplete | FetchAllWorkflowPoints>>[
						new FetchMapStackComplete(mapStack),
					];

					// This is only needed on floor view maps with workflow status toggling enabled
					this.displayOptionsService.getOption$(DisplayOptions.WorkflowStatusToggleEnabled)
						.pipe(take(1))
						.subscribe((workflowStatusToggleEnabled) => {
							if (workflowStatusToggleEnabled) {
								actions.push(new FetchAllWorkflowPoints());
							}
						});
						// When we load the mapstack from the GRM config, the workflow points rendered may currently
						// be overriden, so we fetch the current state from the `/MapPointConfigs` endpoint so that
						// we can represent the most current state accurately on the map.
						// Ideally we would load these independently of the map and track the state of the workflow
						// points in the store. However in map-core's current state we have leaflets mixing state and
						// presentation.
						// Once that is resolved this fetch can be initiated independent of the mapstack loading.
					return actions;
				}),
				catchError((err: Error) => {
					this.log.error('Error fetching map stack:', err);
					return [new FetchMapStackError(err)];
				}),
			),
		),
	);

	@Effect()
	fetchLocal$ = this.actions$.pipe(
		ofType(MapStackActionTypes.FetchLocal),
		mergeMap((action: FetchLocalMapStack) =>
			this.mapStackService.loadLocalMapStack(action.payload).pipe(
				map((mapStack: MapStack) => {
					return new FetchLocalMapStackComplete(mapStack);
				}),
				catchError((err: Error) => {
					this.log.error('Error locally fetching map stack:', err);
					return [new FetchLocalMapStackError(err)];
				}),
			),
		),
	);

	@Effect()
	save$ = this.actions$.pipe(
		ofType(MapStackActionTypes.Save),
		mergeMap(() =>
			this.mapStackStateService.saveMap().then(() => {
				this.log.trace('Saved map stack');
				return new SaveMapStackComplete();
			}),
		),
		catchError((err: Error) => {
			this.log.error('Error saving map stack:', err);
			return [new SaveMapStackError(err)];
		}),
	);

	@Effect()
	saveLocal$ = this.actions$.pipe(
		ofType(MapStackActionTypes.SaveLocal),
		mergeMap(() =>
			this.mapStackStateService.saveLocalMap().then(() => {
				return new SaveLocalMapStackComplete();
			}),
		),
		catchError((err: Error) => {
			this.log.error('Error saving local map stack:', err);
			return [new SaveLocalMapStackError(err)];
		}),
	);

	@Effect()
	generateConnectivityMatrix$ = this.actions$.pipe(
		ofType(MapStackActionTypes.GenerateConnectivityMatrix),
		concatMap(this.mapStackStateService.generateMapStack.bind(this.mapStackStateService)),
		mergeMap((mapStack: Blob) =>
			this.connectivityMatrixService.generateConnectivityMatrix(mapStack).pipe(
				map((connectivityMatrix: ConnectivityMatrix) => {
					return new GenerateConnectivityMatrixComplete(connectivityMatrix);
				}),
				catchError((err: Error) => {
					this.log.error('Error generating connectivity matrix:', err);
					return [new GenerateConnectivityMatrixError(err)];
				}),
			),
		),
	);

	@Effect()
	validate$ = this.actions$.pipe(
		ofType(MapStackActionTypes.ValidateMapStack),
		mergeMap(() =>
			this.mapStackStateService.validateMapStack().then(([valid, errors]) => {
				if (valid) {
					return new ValidateMapStackComplete();
				} else {
					return new ValidateMapStackError(errors);
				}
			}),
		),
	);

	constructor(
		private log: NGXLogger,
		private mapStackService: MapStackService,
		private mapStackStateService: MapStackStateService,
		private connectivityMatrixService: ConnectivityMatrixService,
		private displayOptionsService: DisplayOptionsService,
		private actions$: Actions,
	) {}
}
