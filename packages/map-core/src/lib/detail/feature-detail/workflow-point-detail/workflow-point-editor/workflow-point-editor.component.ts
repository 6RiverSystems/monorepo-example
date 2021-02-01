import { Component, OnChanges, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { WorkflowPoint } from '../../../../class/mapstack/WorkflowPoint';
import { FeatureComponent } from '../../feature.component';
import { WorkflowLabels, WorkflowOptions } from '../../../../interfaces/workflow-labels';

@Component({
	selector: 'workflow-point-editor',
	templateUrl: './workflow-point-editor.component.html',
	styleUrls: ['./workflow-point-editor.component.scss'],
})
export class WorkflowPointEditorComponent extends FeatureComponent implements OnChanges, OnInit {
	@Input() feature: WorkflowPoint;

	readonly workflowLabels = WorkflowLabels;
	readonly workflowOptions = WorkflowOptions;

	constructor(protected fb: FormBuilder, protected ref: ChangeDetectorRef) {
		super(fb, ref);
	}

	ngOnInit() {
		this.form.addControl(
			'pose',
			this.fb.group({
				x: this.feature.pose.x,
				y: this.feature.pose.y,
				orientation: [
					this.feature.pose.orientation,
					Validators.compose([Validators.min(0), Validators.max(360)]),
				],
			}),
		);

		if (this.readOnly) {
			this.form.disable();
		}
	}

	ngOnChanges() {
		this.form.patchValue({ pose: this.feature.pose });
	}
}
