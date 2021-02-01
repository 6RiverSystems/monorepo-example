import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs'; // Must not be removed; will break consumers of the library if it is removed
import { mergeMap, map, catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';
import { UsersListenComplete, UsersListenError, UsersActionTypes } from './users.actions';

@Injectable()
export class UsersEffects {
	@Effect()
	listen$ = this.actions$.pipe(
		ofType(UsersActionTypes.Listen),
		mergeMap(() => this.usersService.getUsers()),
		map((user: User) => {
			this.log.trace('New user data from the asset manager.', user);

			return new UsersListenComplete(user);
		}),
		catchError((err: Error) => {
			this.log.error('Error getting user data from the asset manager.', err);

			return [new UsersListenError(err)];
		}),
	);

	constructor(
		private log: NGXLogger,
		private usersService: UsersService,
		private actions$: Actions,
	) {}
}
