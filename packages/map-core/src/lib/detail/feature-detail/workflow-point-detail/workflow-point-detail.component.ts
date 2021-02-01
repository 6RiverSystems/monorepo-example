import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

import { WorkflowPoint } from '../../../class/mapstack/WorkflowPoint';
import { FeatureComponent } from '../feature.component';
import {
	DisplayOptions,
} from '../../../interfaces/map-display-options';
import { isWorkflowPointConfiguratorEnabled, canEdit } from '../../../display-options/display-options.reducer';
import { MapStackState } from '../../../map-stack/map-stack.reducer';
import { DisplayOptionsService } from '../../../services/display-options.service';


@Component({
	selector: 'workflow-point-detail',
	templateUrl: './workflow-point-detail.component.html',
	styleUrls: ['./workflow-point-detail.component.scss'],
})
export class WorkflowPointDetailComponent extends FeatureComponent implements OnInit {
	@Input() feature: WorkflowPoint;
	public isWorkflowPointConfiguratorEnabled: boolean;
	public isWorkflowPointEditorEnabled: boolean;

	constructor(
		protected fb: FormBuilder,
		protected ref: ChangeDetectorRef,
		public displayOptionsService: DisplayOptionsService,
		private store: Store<MapStackState>)
	{
		super(fb, ref);
	}

	ngOnInit() {
		this.store.select(isWorkflowPointConfiguratorEnabled).subscribe((result) => {
			this.isWorkflowPointConfiguratorEnabled = result;
		});
		this.store.select(canEdit, DisplayOptions.WorkflowPoint).subscribe((result) => {
			this.isWorkflowPointEditorEnabled = result;
		});
	}

	
}
