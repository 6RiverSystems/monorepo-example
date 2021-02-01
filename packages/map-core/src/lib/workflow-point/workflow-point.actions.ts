import { Action } from '@ngrx/store';

import { MapCoreError } from '../interfaces/map-core-error';
import { WorkflowPointState } from '../interfaces/workflow-point-state';

export enum WorkflowPointActionTypes {
	Listen = '[WorkflowPoint] Listen',
	Fetch = '[WorkflowPoint] Fetch',
	FetchComplete = '[WorkflowPoint] Fetch Success',
	FetchAllComplete = '[WorkflowPoint] Fetch Success',
	FetchError = '[WorkflowPoint] Fetch Error',
	FetchWorkflowPoints = '[WorkflowPoint] FetchWorkflowPoints',
	FetchWorkflowPoint = '[WorkflowPoint] FetchWorkflowPoint',
	FetchWorkflowPointComplete = '[WorkflowPoint] FetchWorkflowPointComplete',
	FetchWorkflowPointError = '[WorkflowPoint] FetchWorkflowPointError',
	StateUpdated = '[WorkflowPoint] StateUpdated',
}

abstract class ErrorAction implements Action {
	readonly type: WorkflowPointActionTypes;
}

export class FetchWorkflowPoint implements Action {
	readonly type = WorkflowPointActionTypes.Fetch;

	constructor(public mapPointName?: string) {}
}

export class FetchWorkflowPointComplete implements Action {
	readonly type = WorkflowPointActionTypes.FetchComplete;

	constructor(public payload: WorkflowPointState) {}
}

export class FetchWorkflowPointsComplete implements Action {
	readonly type = WorkflowPointActionTypes.FetchAllComplete;

	constructor(public payload: WorkflowPointState[]) {}
}

export class StateUpdated implements Action {
	readonly type = WorkflowPointActionTypes.StateUpdated;

	constructor(public payload: WorkflowPointState) {}
}

export class FetchWorkflowPointError implements ErrorAction {
	readonly type = WorkflowPointActionTypes.FetchError;

	constructor(public error: MapCoreError) {}
}

export class FetchAllWorkflowPoints implements Action {
	readonly type = WorkflowPointActionTypes.FetchWorkflowPoints;
}

export class WorkflowPointsListen implements Action {
	readonly type = WorkflowPointActionTypes.Listen;

	constructor() {}
}

export type WorkflowPointActions =
	| FetchWorkflowPoint
	| FetchWorkflowPointComplete
	| FetchAllWorkflowPoints
	| FetchWorkflowPoint
	| FetchWorkflowPointComplete
	| WorkflowPointsListen;

export type WorkflowPointErrorActions = FetchWorkflowPointError;
