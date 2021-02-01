import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { WorkflowPointEditorComponent } from './workflow-point-editor.component';
import { WorkflowPoint } from '../../../../class/mapstack/WorkflowPoint';
import { getRandomPose } from '../../../../test/pose-factory';
import { TestModule } from '../../../../test.module';

describe('WorkflowPointEditorComponent', () => {
	let component: WorkflowPointEditorComponent;
	let fixture: ComponentFixture<WorkflowPointEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WorkflowPointEditorComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
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
