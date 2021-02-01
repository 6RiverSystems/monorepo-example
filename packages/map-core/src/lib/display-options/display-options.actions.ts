import { Action } from '@ngrx/store';

import { DisplayOptionsMap, DisplayOptionValue } from '../interfaces/map-display-options';

export enum DisplayOptionsActionTypes {
	SetDisplayOptions = '[DisplayOptions] Set',
	SetDisplayOption = '[DisplayOptions] SetOption'
}

export class SetDisplayOptions implements Action {
	readonly type = DisplayOptionsActionTypes.SetDisplayOptions;

	constructor(public options: DisplayOptionsMap) {}
}

export class SetDisplayOption implements Action {
	readonly type = DisplayOptionsActionTypes.SetDisplayOption;

	constructor(public key: string, public value: DisplayOptionValue) {}
}

export type DisplayOptionsActions =
	| SetDisplayOptions
	| SetDisplayOption;
