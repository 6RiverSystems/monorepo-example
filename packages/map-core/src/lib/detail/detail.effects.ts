import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { MatSidenavContainer } from '@angular/material/sidenav';

import { DetailActions, DetailActionTypes, DetailOpen, DetailClose } from './detail.actions';

@Injectable()
export class DetailEffects {
	// @Effect()
	// open$ = this.actions$
	// 	.ofType(DetailActionTypes.DetailOpen);

	// @Effect()
	// close$ = this.actions$
	// 	.ofType(DetailActionTypes.DetailClose);

	constructor(private actions$: Actions) {}
}
