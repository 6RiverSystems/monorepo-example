import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
	FetchWorkflowPoint,
	FetchWorkflowPointComplete,
	FetchWorkflowPointsComplete,
	StateUpdated,
	FetchWorkflowPointError,
	FetchAllWorkflowPoints,
	WorkflowPointActionTypes,
} from './workflow-point.actions';
import { WorkflowPointService } from '../services/workflow-point.service';
import { MapStackStateService } from '../services/map-stack-state.service';
import { WorkflowPointState } from '../interfaces/workflow-point-state';
import { MapCoreState } from '../reducers';

@Injectable()
export class WorkflowPointEffects {
	@Effect()
	fetch$ = this.actions$.pipe(
		ofType(WorkflowPointActionTypes.Fetch),
		mergeMap((action: FetchWorkflowPoint) =>
			this.workflowPointService.getWorkflowPointState(action.mapPointName).pipe(
				map((workflowPoint: WorkflowPointState) => {
					return new FetchWorkflowPointComplete(workflowPoint);
				}),
				catchError((err: Error) => {
					this.log.error('Error fetching workflow point:', err);
					return [new FetchWorkflowPointError(err)];
				}),
			),
		),
	);

	@Effect()
	fetchAllWorkflowPoints$ = this.actions$.pipe(
		ofType(WorkflowPointActionTypes.FetchWorkflowPoints),
		mergeMap((action: FetchAllWorkflowPoints) => {
			return this.workflowPointService.getWorkflowPointStates().pipe(
				map((workflowPoints: WorkflowPointState[] | FetchWorkflowPointError) => {
					if (!(workflowPoints as FetchWorkflowPointError).type) {
						workflowPoints = <WorkflowPointState[]>workflowPoints;
						workflowPoints.forEach((workflowPoint: WorkflowPointState) => {
							this.store.dispatch(new FetchWorkflowPointComplete(workflowPoint));
						});
						return new FetchWorkflowPointsComplete(workflowPoints);
					} else {
						return workflowPoints;
					}
				}),
				catchError((err: Error) => {
					this.log.error('Error fetching all workflow points:', err);
					return [new FetchWorkflowPointError(err)];
				}),
			);
		}),
	);

	@Effect()
	fetchWorkFlowPointComplete$ = this.actions$.pipe(
		ofType(WorkflowPointActionTypes.FetchComplete),
		mergeMap((action: FetchWorkflowPointComplete) => {
			return of(this.mapStackStateService.updateWorkflowPointState(action.payload)).pipe(
				map(() => new StateUpdated(action.payload)),
			);
		}),
	);

	@Effect()
	listen$ = this.actions$.pipe(
		ofType(WorkflowPointActionTypes.Listen),
		mergeMap((action: FetchAllWorkflowPoints) => {
			return this.workflowPointService.observeStream().pipe(
				map((workflowPoint: WorkflowPointState) => {
					return new FetchWorkflowPointComplete(workflowPoint);
				}),
				catchError((err: Error) => {
					this.log.error('Error fetching all workflow points:', err);
					return [new FetchWorkflowPointError(err)];
				}),
			);
		}),
	);

	constructor(
		private log: NGXLogger,
		private workflowPointService: WorkflowPointService,
		private mapStackStateService: MapStackStateService,
		private store: Store<MapCoreState>,
		private actions$: Actions,
	) {}
}
