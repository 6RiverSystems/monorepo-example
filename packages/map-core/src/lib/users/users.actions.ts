import { Action } from '@ngrx/store';

import { User } from '../interfaces/user';

export enum UsersActionTypes {
	Listen = '[Users] Listen',
	ListenComplete = '[Users] ListenComplete',
	ListenError = '[Users] ListenError',
}

export class UsersListen implements Action {
	readonly type = UsersActionTypes.Listen;

	constructor() {}
}

export class UsersListenComplete implements Action {
	readonly type = UsersActionTypes.ListenComplete;

	constructor(public payload: User) {}
}

export class UsersListenError implements Action {
	readonly type = UsersActionTypes.ListenError;

	constructor(public payload: Error) {}
}

export type UsersActions = UsersListen | UsersListenComplete | UsersListenError;
