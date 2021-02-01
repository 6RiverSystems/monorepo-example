import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { WorkflowPointService } from '../../../../services/workflow-point.service';
import { MAP_CORE_CONFIG } from '../../../../interfaces/config';
import { DisplayOptions, DisplayOptionValue } from '../../../../interfaces/map-display-options';
import { WorkflowPointConfiguratorComponent } from './workflow-point-configurator.component';
import { TestModule } from '../../../../test.module';
import { getRandomPose } from '../../../../test/pose-factory';
import { WorkflowPoint } from '../../../../class/mapstack/WorkflowPoint';
import { WorkflowPointState } from '../../../../interfaces/workflow-point-state';
import { DisplayOptionsService } from '../../../../services/display-options.service';

describe('WorkflowPointConfiguratorComponent', () => {
	let component: WorkflowPointConfiguratorComponent;
	let fixture: ComponentFixture<WorkflowPointConfiguratorComponent>;
	let httpTestingController: HttpTestingController;
	let displayOptionsService: DisplayOptionsService;

	const loadWorkflowPointConfiguratorComponent = (
		options: Map<DisplayOptions, DisplayOptionValue>,
		workflowPointState: WorkflowPointState,
		queueDepthToggleEnabled: boolean,
		workflowPointStatusToggleEnabled: boolean,
	) => {
		spyOn(component.mapStackStateService, 'updateWorkflowPointState');
		component.ngOnInit();

		const req = httpTestingController.expectOne(
			`http://localhost:3003/v1/MapPointConfigs/${encodeURIComponent(component.feature.name)}`,
		);
		expect(req.request.method).toEqual('GET');
		req.flush(workflowPointState);

		expect(component.workflowPointState).toEqual(workflowPointState);

		expect(component.isQueueDepthToggleEnabled).toBe(
			options ? queueDepthToggleEnabled : false,
		);

		expect(component.enabled).toBe(workflowPointState.enabled);

		expect(component.queueDepth).toBe(workflowPointState.maxReservationCount);

		expect(component.isWorkflowPointToggleEnabled).toBe(
			options ? workflowPointStatusToggleEnabled : false,
		);

		expect(component.mapStackStateService.updateWorkflowPointState).toHaveBeenCalledTimes(
			component.isWorkflowPointToggleEnabled ? 1 : 0,
		);
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, TestModule],
			providers: [
				DisplayOptionsService,
				WorkflowPointService,
				{
					provide: MAP_CORE_CONFIG,
					useValue: new BehaviorSubject({
						mapManagerBaseUrl: 'http://localhost:3003',
					}),
				},
			],
		}).compileComponents();
		displayOptionsService = TestBed.get(DisplayOptionsService);
		fixture = TestBed.createComponent(WorkflowPointConfiguratorComponent);
		httpTestingController = TestBed.get(HttpTestingController);
		component = fixture.componentInstance;
		component.feature = new WorkflowPoint(getRandomPose(), {});
		component.feature.name = 'TestWorkflowPoint';
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('WorkflowStatusToggleEnabled and QueueDepthToggleEnabled options should set correct state', async () => {
		const options = new Map<DisplayOptions, DisplayOptionValue>([
			[DisplayOptions.QueueDepthToggleEnabled, true],
			[DisplayOptions.WorkflowStatusToggleEnabled, true],
		]);
		const workflowPointState = {
			mapPointName: 'TestWorkflowPoint',
			enabled: true,
			maxReservationCount: 5,
		};
		
		displayOptionsService.setOptions(options);
		loadWorkflowPointConfiguratorComponent(options, workflowPointState, true, true);
	});

	it('WorkflowStatusToggleEnabled without QueueDepthToggleEnabled should set correct component state', async () => {
		const options = new Map<DisplayOptions, DisplayOptionValue>([
			[DisplayOptions.QueueDepthToggleEnabled, false],
			[DisplayOptions.WorkflowStatusToggleEnabled, true],
		]);

		const workflowPointState = {
			mapPointName: 'TestWorkflowPoint',
			enabled: true,
			maxReservationCount: 5,
		};
		displayOptionsService.setOptions(options);
		loadWorkflowPointConfiguratorComponent(options, workflowPointState, false, true);
	});

	it('QueueDepthToggleEnabled without WorkflowStatusToggleEnabled should set correct component state', async () => {
		const options = new Map<DisplayOptions, DisplayOptionValue>([
			[DisplayOptions.QueueDepthToggleEnabled, true],
			[DisplayOptions.WorkflowStatusToggleEnabled, false],
		]);

		const workflowPointState = {
			mapPointName: 'TestWorkflowPoint',
			enabled: true,
			maxReservationCount: 5,
		};
		displayOptionsService.setOptions(options);
		loadWorkflowPointConfiguratorComponent(options, workflowPointState, true, false);
	});

	it('No options should set correct component state', async () => {
		const options = undefined;
		const workflowPointState = {
			mapPointName: 'TestWorkflowPoint',
			enabled: true,
			maxReservationCount: 1000,
		};
		displayOptionsService.setOptions(options);
		loadWorkflowPointConfiguratorComponent(options, workflowPointState, false, false);
	});
});
