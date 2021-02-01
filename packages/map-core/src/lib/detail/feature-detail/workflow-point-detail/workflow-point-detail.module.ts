import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/* eslint-disable max-len*/
import { WorkflowPointConfiguratorComponent } from './workflow-point-configurator/workflow-point-configurator.component';
import { WorkflowPointDetailComponent } from './workflow-point-detail.component';
import { WorkflowPointEditorComponent } from './workflow-point-editor/workflow-point-editor.component';
import { MaterialModule } from '../../../material.module';
import { FeatureDetailSharedModule } from '../feature-detail-shared.module';
import { SpinnerModule } from '../../../spinner/spinner.module';

@NgModule({
	imports: [
		CommonModule,
		FeatureDetailSharedModule,
		ReactiveFormsModule,
		MaterialModule,
		SpinnerModule,
	],
	declarations: [
		WorkflowPointConfiguratorComponent,
		WorkflowPointEditorComponent,
		WorkflowPointDetailComponent,
	],
	exports: [WorkflowPointDetailComponent],
})
export class WorkflowPointDetailModule {}
