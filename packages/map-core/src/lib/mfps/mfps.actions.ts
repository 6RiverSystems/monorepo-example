import { Action } from '@ngrx/store';

import { MfpParams } from '../interfaces/mfp';
import { SiteName } from '../interfaces/site';
import { Filter } from './mfps.reducer';

export enum MfpsActionTypes {
	Listen = '[Mfps] Listen',
	ListenError = '[Mfps] ListenError',
	ListenWork = '[Mfps] ListenWork',
	ListenWorkComplete = '[Mfps] ListenWorkComplete',
	ListenWorkError = '[Mfps] ListenWorkError',
	Fetch = '[Mfps] Fetch',
	FetchComplete = '[Mfps] Fetch Success',
	FetchError = '[Mfps] Fetch Error',
	Filter = '[Mfps] Filter',
}

export class MfpsListen implements Action {
	readonly type = MfpsActionTypes.Listen;

	constructor() {}
}

export class MfpsListenError implements Action {
	readonly type = MfpsActionTypes.ListenError;

	constructor(public payload: Error) {}
}

export class MfpsListenWork implements Action {
	readonly type = MfpsActionTypes.ListenWork;

	constructor() {}
}

export class MfpsListenWorkComplete implements Action {
	readonly type = MfpsActionTypes.ListenWorkComplete;

	constructor(public payload: MfpParams) {}
}

export class MfpsListenWorkError implements Action {
	readonly type = MfpsActionTypes.ListenWorkError;

	constructor(public payload: Error) {}
}

export class MfpsFetch implements Action {
	readonly type = MfpsActionTypes.Fetch;

	constructor(public payload: SiteName) {}
}

export class MfpsFetchComplete implements Action {
	readonly type = MfpsActionTypes.FetchComplete;

	constructor(public payload: MfpParams) {}
}

export class MfpsFetchError implements Action {
	readonly type = MfpsActionTypes.FetchError;

	constructor(public payload: Error) {}
}

export class MfpsFilter implements Action {
	readonly type = MfpsActionTypes.Filter;

	constructor(public payload: Filter) {}
}

export type MfpsActions =
	| MfpsListen
	| MfpsListenError
	| MfpsListenWork
	| MfpsListenWorkComplete
	| MfpsListenWorkError
	| MfpsFetch
	| MfpsFetchComplete
	| MfpsFetchError
	| MfpsFilter;
