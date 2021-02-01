import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomPose } from '../../../test/pose-factory';
import { WorkflowPointDetailComponent } from './workflow-point-detail.component';
import { TestModule } from '../../../test.module';
import { WorkflowPoint } from '../../../class/mapstack/WorkflowPoint';
import { DisplayOptionsService } from '../../../services/display-options.service';

describe('WorkflowPointDetailComponent', () => {
	let component: WorkflowPointDetailComponent;
	let fixture: ComponentFixture<WorkflowPointDetailComponent>;
	let displayOptionsService: DisplayOptionsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [DisplayOptionsService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WorkflowPointDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		displayOptionsService = TestBed.get(DisplayOptionsService);
		displayOptionsService.selectPreset('liveViewOptions');
		component.feature = new WorkflowPoint(getRandomPose(), {});
		component.feature.labels = [];
		component.feature.workflowOptions = [];
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
