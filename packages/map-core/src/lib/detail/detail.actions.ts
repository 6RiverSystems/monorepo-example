import { Action } from '@ngrx/store';

import { Layer } from '../interfaces/layer';

export enum DetailActionTypes {
	Open = '[Detail] Open',
	Update = '[Detail] Update',
	Close = '[Detail] Close',
}

export class DetailOpen implements Action {
	readonly type = DetailActionTypes.Open;

	constructor(public payload: Layer[]) {}
}

export class DetailUpdate implements Action {
	readonly type = DetailActionTypes.Update;

	constructor(public payload: Layer[]) {}
}

export class DetailClose implements Action {
	readonly type = DetailActionTypes.Close;
}

export type DetailActions = DetailOpen | DetailUpdate | DetailClose;
