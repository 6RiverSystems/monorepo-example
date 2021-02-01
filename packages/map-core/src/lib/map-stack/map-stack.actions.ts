import { Action } from '@ngrx/store';
import { ConnectivityMatrix } from '@sixriver/map-io';
import { ValidationError } from '@sixriver/map-validator';

import { MapStack } from '../class/mapstack/MapStack';
import { MapStackMeta } from '../interfaces/map-stack-meta';
import { MapCoreError } from '../interfaces/map-core-error';

export enum MapStackActionTypes {
	Fetch = '[MapStack] Fetch',
	FetchComplete = '[MapStack] Fetch Success',
	FetchError = '[MapStack] Fetch Error',
	FetchLocal = '[MapStack] Fetch Locally',
	FetchLocalComplete = '[MapStack] Local Fetch Success',
	FetchLocalError = '[MapStack] Local Fetch Error',
	Set = '[MapStack] Set',
	Save = '[MapStack] Save',
	SaveComplete = '[MapStack] Save Complete',
	SaveError = '[MapStack] Save Error',
	SaveLocal = '[MapStack] Save Locally',
	SaveLocalComplete = '[MapStack] Local Save Complete',
	SaveLocalError = '[MapStack] Local Save Error',
	SetConnectivityMatrixValid = '[MapStack] Set Connectivity Matrix Valid',
	GenerateConnectivityMatrix = '[MapStack] Generate Connectivity Matrix',
	GenerateConnectivityMatrixComplete = '[MapStack] Generate Connectivity Matrix Complete',
	GenerateConnectivityMatrixError = '[MapStack] Generate Connectivity Matrix Error',
	ValidateMapStack = '[MapStack] Validate Map Stack',
	ValidationComplete = '[MapStack] Validation Complete',
	ValidationError = '[MapStack] Validation Failed',
	NotSaved = '[MapStack] Not Saved',
}

abstract class ErrorAction implements Action {
	readonly type: MapStackActionTypes;
}

export class FetchMapStack implements Action {
	readonly type = MapStackActionTypes.Fetch;

	constructor(public payload?: MapStackMeta) {}
}

export class FetchMapStackComplete implements Action {
	readonly type = MapStackActionTypes.FetchComplete;

	constructor(public payload: MapStack) {}
}

export class FetchMapStackError implements ErrorAction {
	readonly type = MapStackActionTypes.FetchError;

	constructor(public payload: MapCoreError) {}
}

export class FetchLocalMapStack implements Action {
	readonly type = MapStackActionTypes.FetchLocal;

	constructor(public payload?: File) {}
}

export class FetchLocalMapStackComplete implements Action {
	readonly type = MapStackActionTypes.FetchLocalComplete;

	constructor(public payload: MapStack) {}
}

export class FetchLocalMapStackError implements ErrorAction {
	readonly type = MapStackActionTypes.FetchLocalError;

	constructor(public payload: MapCoreError) {}
}

export class SetMapStack implements Action {
	readonly type = MapStackActionTypes.Set;

	constructor(public payload: MapStack) {}
}

export class SaveMapStack implements Action {
	readonly type = MapStackActionTypes.Save;
}

export class SaveMapStackComplete implements Action {
	readonly type = MapStackActionTypes.SaveComplete;
}

export class SaveMapStackError implements ErrorAction {
	readonly type = MapStackActionTypes.SaveError;

	constructor(public payload: MapCoreError) {}
}

export class SaveLocalMapStack implements Action {
	readonly type = MapStackActionTypes.SaveLocal;
}

export class SaveLocalMapStackComplete implements Action {
	readonly type = MapStackActionTypes.SaveLocalComplete;
}

export class SaveLocalMapStackError implements ErrorAction {
	readonly type = MapStackActionTypes.SaveLocalError;

	constructor(public payload: MapCoreError) {}
}

export class MapStackNotSaved implements Action {
	readonly type = MapStackActionTypes.NotSaved;
}

export class SetConnectivityMatrixValid implements Action {
	readonly type = MapStackActionTypes.SetConnectivityMatrixValid;

	constructor(public payload: boolean) {}
}

export class GenerateConnectivityMatrix implements Action {
	readonly type = MapStackActionTypes.GenerateConnectivityMatrix;

	constructor(public payload: MapStack) {}
}

export class GenerateConnectivityMatrixComplete implements Action {
	readonly type = MapStackActionTypes.GenerateConnectivityMatrixComplete;

	constructor(public payload: ConnectivityMatrix) {}
}

export class GenerateConnectivityMatrixError implements ErrorAction {
	readonly type = MapStackActionTypes.GenerateConnectivityMatrixError;

	constructor(public payload: MapCoreError) {}
}

export class ValidateMapStack implements Action {
	readonly type = MapStackActionTypes.ValidateMapStack;

	constructor(public payload: MapStack) {}
}

export class ValidateMapStackComplete implements Action {
	readonly type = MapStackActionTypes.ValidationComplete;

	constructor() {}
}

export class ValidateMapStackError implements ErrorAction {
	readonly type = MapStackActionTypes.ValidationError;

	constructor(public payload: ValidationError[]) {}
}

export type MapStackActions =
	| FetchMapStack
	| FetchMapStackComplete
	| FetchLocalMapStack
	| FetchLocalMapStackComplete
	| SaveMapStack
	| SaveMapStackComplete
	| SaveLocalMapStack
	| SaveLocalMapStackComplete
	| SetMapStack
	| MapStackNotSaved
	| SetConnectivityMatrixValid
	| GenerateConnectivityMatrix
	| GenerateConnectivityMatrixComplete
	| ValidateMapStack
	| ValidateMapStackComplete;

export type MapStackErrorActions =
	| FetchMapStackError
	| FetchLocalMapStackError
	| SaveMapStackError
	| SaveLocalMapStackError
	| GenerateConnectivityMatrixError
	| ValidateMapStackError;
