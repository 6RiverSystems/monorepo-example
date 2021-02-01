import { Action } from '@ngrx/store';

export enum SelectionActionTypes {
	Select = '[Selection] Select',
	Deselect = '[Selection] Deselect',
	Clear = '[Selection] Clear',
}

export class SelectionSelect implements Action {
	readonly type = SelectionActionTypes.Select;

	constructor(public payload: { uuids: string[]; add: boolean }) {}
}

export class SelectionDeselect implements Action {
	readonly type = SelectionActionTypes.Deselect;

	constructor(public payload: string[]) {}
}

export class SelectionClear implements Action {
	readonly type = SelectionActionTypes.Clear;
}

export type SelectionActions = SelectionSelect | SelectionDeselect | SelectionClear;
