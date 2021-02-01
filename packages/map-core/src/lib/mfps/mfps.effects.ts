import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { MfpParams } from '../interfaces/mfp';
import { MfpsService } from '../services/mfps.service';
import { MfpWorkflowService } from '../services/mfp-work.service';
import { MfpsLogDnaService } from '../services/mfps-log-dna.service';
import {
	MfpsListenError,
	MfpsFetchComplete,
	MfpsListenWorkComplete,
	MfpsListenWorkError,
	MfpsActionTypes,
} from './mfps.actions';

@Injectable()
export class MfpsEffects {
	// TODO refactor to use MfpParams interface instead of Mfp class
	// @Effect()
	// fetch$ = this.actions$
	// 	.ofType(MfpsActionTypes.Fetch)
	// 	.mergeMap((action: MfpsFetch) => this.mfpService.getMfps(action.payload))
	// 	.map((mfps: Map<string, Mfp>) => {
	// 		this.log.trace('New data from LogDNA.', mfps);

	// 		return new MfpsFetchComplete(mfps);
	// 	})
	// 	.catch((err: Error) => {
	// 		this.log.error('Error fetching data from LogDNA.', err);

	// 		return [new MfpsFetchError(err)];
	// 	});

	@Effect()
	listen$ = this.actions$.pipe(
		ofType(MfpsActionTypes.Listen),
		mergeMap(() => this.mfpsService.listen()),
		map((mfp: MfpParams) => {
			this.log.trace({ mfp: mfp.id }, 'New MFP data from the socket.io server.', mfp);

			return new MfpsFetchComplete(mfp);
		}),
		catchError((err: Error) => {
			this.log.error('Error listening for events from the socket.io server.', err);

			return [new MfpsListenError(err)];
		}),
	);

	@Effect()
	listenWork$ = this.actions$.pipe(
		ofType(MfpsActionTypes.ListenWork),
		mergeMap(() => this.mfpWorkflowService.getWorkflow()),
		map((mfp: MfpParams) => {
			this.log.trace({ mfp: mfp.id }, 'New MFP work from the task coordinator.', mfp);

			return new MfpsListenWorkComplete(mfp);
		}),
		catchError((err: Error) => {
			this.log.error('Error getting work data from the task coordinator.', err);

			return [new MfpsListenWorkError(err)];
		}),
	);

	constructor(
		private log: NGXLogger,
		private mfpsService: MfpsService,
		private mfpService: MfpsLogDnaService,
		private mfpWorkflowService: MfpWorkflowService,
		private actions$: Actions,
	) {}
}
