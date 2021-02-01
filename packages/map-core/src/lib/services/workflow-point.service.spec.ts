import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockEvent, EventSource } from 'mocksse';

import { TestModule } from '../test.module';
import { FetchWorkflowPointError } from '../workflow-point/workflow-point.actions';
import { WorkflowPointService } from './workflow-point.service';
import { WorkflowPointState } from '../interfaces/workflow-point-state';

describe('WorkflowPointService', () => {
	let service: WorkflowPointService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule, HttpClientTestingModule],
			providers: [WorkflowPointService],
		});
		httpTestingController = TestBed.get(HttpTestingController);
		service = TestBed.get(WorkflowPointService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getWorkflowPointState', () => {
		it('should fetch the map point config overrides', async () => {
			const workflowPointState = <WorkflowPointState>{
				mapPointName: 'beans',
				enabled: true,
				maxReservationCount: 99,
			};
			service.getWorkflowPointState('beans').subscribe(response => {
				if (!(response instanceof FetchWorkflowPointError)) {
					response = <WorkflowPointState>response;
					expect(response.enabled).toEqual(true);
				}
			});
			const req = httpTestingController.expectOne(
				`http://localhost:3003/v1/MapPointConfigs/${workflowPointState.mapPointName}`,
			);
			expect(req.request.method).toEqual('GET');
			expect(req.cancelled).toBeFalsy();
			req.flush(workflowPointState);
		});

		it('should handle a network error', async () => {
			const fetchWorkflowPointError = {
				type: ['504'],
				payload: {
					error: 'Gateway timeout',
				},
			};
			service.getWorkflowPointState('beans').subscribe(response => {
				if (response instanceof FetchWorkflowPointError) {
					response = <FetchWorkflowPointError>response;
					expect(response.type).toEqual(fetchWorkflowPointError.type);
				}
			});
			const req = httpTestingController.expectOne(`http://localhost:3003/v1/MapPointConfigs/beans`);
			expect(req.request.method).toEqual('GET');
			expect(req.cancelled).toBeFalsy();
			req.flush(fetchWorkflowPointError);
		});
	});

	describe('getWorkflowPointStates', () => {
		it('should fetch all map point config overrides', async () => {
			const workflowPointState = <WorkflowPointState>{
				mapPointName: 'beans',
				enabled: true,
				maxReservationCount: 99,
			};
			service.getWorkflowPointStates().subscribe(response => {
				if (!(response instanceof FetchWorkflowPointError)) {
					response = response;
					expect(response.shift().enabled).toEqual(true);
				}
			});
			const req = httpTestingController.expectOne('http://localhost:3003/v1/MapPointConfigs');
			expect(req.request.method).toEqual('GET');
			expect(req.cancelled).toBeFalsy();
			req.flush([workflowPointState]);
		});

		it('should handle a network error', async () => {
			const fetchWorkflowPointError = {
				type: ['504'],
				payload: {
					error: 'Gateway timeout',
				},
			};
			service.getWorkflowPointStates().subscribe(response => {
				if (response instanceof FetchWorkflowPointError) {
					response = <FetchWorkflowPointError>response;
					expect(response.type).toEqual(fetchWorkflowPointError.type);
				}
			});
			const req = httpTestingController.expectOne(`http://localhost:3003/v1/MapPointConfigs`);
			expect(req.request.method).toEqual('GET');
			expect(req.cancelled).toBeFalsy();
			req.flush(fetchWorkflowPointError);
		});
	});

	describe('getWorkflowPointStates', () => {
		// server sent event message fixture
		const sseFixture = {
			target: 'Picking 1',
			data: {
				mapPointName: 'Picking 1',
				maxReservationCount: 1,
				enabled: false,
				createdAt: '2019-12-18T20:38:30.726Z',
				updatedAt: '2020-01-08T13:43:45.966Z',
			},
			type: 'update',
		};

		beforeEach(() => {
			const mockEvent = new MockEvent({
				url: 'http://localhost:3003/v1/MapPointConfigOverrides/change-stream',
				responses: [sseFixture],
			});
			const eventSource = new EventSource(
				'http://localhost:3003/v1/MapPointConfigOverrides/change-stream',
			);
		});

		it('should fetch all map point config overrides', async () => {
			service.observeStream().subscribe((message: WorkflowPointState) => {
				expect(message.mapPointName).toEqual(sseFixture.data.mapPointName);
				expect(message.enabled).toEqual(sseFixture.data.enabled);
				expect(message.maxReservationCount).toEqual(sseFixture.data.maxReservationCount);
			});
		});
	});
});
