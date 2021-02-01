import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { WorkflowPointEffects } from './workflow-point.effects';
import { TestModule } from '../test.module';
import { WorkflowPointService } from '../services/workflow-point.service';
import { MapStackStateService } from '../services/map-stack-state.service';
import {
	createExpectedActionObservable,
	createInitialActionObservable,
} from '../test/effect-testing';
import {
	FetchWorkflowPoint,
	FetchWorkflowPointComplete,
	FetchWorkflowPointsComplete,
	StateUpdated,
	FetchWorkflowPointError,
	FetchAllWorkflowPoints,
	WorkflowPointsListen,
} from './workflow-point.actions';
import { MapCoreError } from '../interfaces/map-core-error';
import { DisplayOptionsService } from '../services/display-options.service';

describe('WorkflowPointEffects', () => {
	let effects: WorkflowPointEffects;
	let actions$: Observable<any>;
	let workflowPointService: WorkflowPointService;
	let mapStackStateService: MapStackStateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule, NoopAnimationsModule],
			providers: [
				DisplayOptionsService,
				WorkflowPointEffects,
				WorkflowPointService,
				provideMockActions(() => actions$)
			],
		});

		effects = TestBed.get(WorkflowPointEffects);
		workflowPointService = TestBed.get(WorkflowPointService);
		mapStackStateService = TestBed.get(MapStackStateService);
	});

	it('should be created', () => {
		expect(effects).toBeTruthy();
	});

	describe('getWorkflowPointState', () => {
		it('should dispatch the correct actions on success', () => {
			const workflowPointState = {
				mapPointName: 'TestWorkflowPoint',
				enabled: true,
				maxReservationCount: 5,
			};
			spyOn(workflowPointService, 'getWorkflowPointState').and.returnValue(of(workflowPointState));

			actions$ = createInitialActionObservable(new FetchWorkflowPoint('moose'));
			const expected = createExpectedActionObservable([
				new FetchWorkflowPointComplete(workflowPointState),
			]);
			expect(effects.fetch$).toBeObservable(expected);
		});

		it('should dispatch the correct action on failure', () => {
			const error = new MapCoreError('network error');
			spyOn(workflowPointService, 'getWorkflowPointState').and.returnValue(throwError(error));

			actions$ = createInitialActionObservable(new FetchWorkflowPoint('moose'));
			const expected = createExpectedActionObservable([new FetchWorkflowPointError(error)]);
			expect(effects.fetch$).toBeObservable(expected);
		});
	});

	describe('getWorkflowPointStates', () => {
		it('should dispatch the correct actions on success', () => {
			const workflowPointState = {
				mapPointName: 'TestWorkflowPoint',
				enabled: true,
				maxReservationCount: 5,
			};
			spyOn(workflowPointService, 'getWorkflowPointStates').and.returnValue(
				of([workflowPointState]),
			);

			actions$ = createInitialActionObservable(new FetchAllWorkflowPoints());
			const expected = createExpectedActionObservable([
				new FetchWorkflowPointsComplete([workflowPointState]),
			]);
			expect(effects.fetchAllWorkflowPoints$).toBeObservable(expected);
		});

		it('should dispatch the correct action on failure', () => {
			const error = new MapCoreError('network error');
			spyOn(workflowPointService, 'getWorkflowPointStates').and.returnValue(throwError(error));

			actions$ = createInitialActionObservable(new FetchAllWorkflowPoints());
			const expected = createExpectedActionObservable([new FetchWorkflowPointError(error)]);
			expect(effects.fetchAllWorkflowPoints$).toBeObservable(expected);
		});
	});

	describe('fetchWorkFlowPointComplete', () => {
		it('should dispatch the correct actions on success', () => {
			const workflowPointState = {
				mapPointName: 'TestWorkflowPoint',
				enabled: true,
				maxReservationCount: 5,
			};
			spyOn(mapStackStateService, 'updateWorkflowPointState').and.returnValue(
				of(workflowPointState),
			);

			actions$ = createInitialActionObservable(new FetchWorkflowPointComplete(workflowPointState));
			const expected = createExpectedActionObservable([new StateUpdated(workflowPointState)]);
			expect(effects.fetchWorkFlowPointComplete$).toBeObservable(expected);
		});
	});

	describe('listen', () => {
		it('should dispatch the correct actions on success', () => {
			const workflowPointState = {
				mapPointName: 'TestWorkflowPoint',
				enabled: true,
				maxReservationCount: 5,
			};
			spyOn(workflowPointService, 'observeStream').and.returnValue(of(workflowPointState));

			actions$ = createInitialActionObservable(new WorkflowPointsListen());
			const expected = createExpectedActionObservable([
				new FetchWorkflowPointComplete(workflowPointState),
			]);
			expect(effects.listen$).toBeObservable(expected);
		});

		it('should dispatch the correct action on failure', () => {
			const error = new MapCoreError('network error');
			spyOn(workflowPointService, 'observeStream').and.returnValue(throwError(error));

			actions$ = createInitialActionObservable(new WorkflowPointsListen());
			const expected = createExpectedActionObservable([new FetchWorkflowPointError(error)]);
			expect(effects.listen$).toBeObservable(expected);
		});
	});
});
