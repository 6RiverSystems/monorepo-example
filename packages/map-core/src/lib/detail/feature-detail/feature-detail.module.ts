import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerModule, NGXLogger } from 'ngx-logger';

import { AisleDetailComponent } from './aisle-detail/aisle-detail.component';
import { CostAreaDetailComponent } from './cost-area-detail/cost-area-detail.component';
import { FeatureDetailComponent } from './feature-detail.component';
import { ImpassableAreaDetailComponent } from './impassable-area-detail/impassable-area-detail.component';
import { SimulatedObjectDetailComponent } from './simulated-object-detail/simulated-object-detail.component';
import { KeepOutAreaDetailComponent } from './keep-out-area-detail/keep-out-area-detail.component';
import { MapStackStateService } from '../../services/map-stack-state.service';
import { QueueAreaDetailComponent } from './queue-area-detail/queue-area-detail.component';
import { SpeedLimitAreaDetailComponent } from './speed-limit-area-detail/speed-limit-area-detail.component';
import { StayOnPathAreaDetailComponent } from './stay-on-path-area-detail/stay-on-path-area-detail.component';
import { WeightedAreaDetailComponent } from './weighted-area-detail/weighted-area-detail.component';
import { WorkflowPointDetailModule } from './workflow-point-detail/workflow-point-detail.module';
import { MaterialModule } from '../../material.module';
import { FeatureComponent } from './feature.component';
import { FeatureDetailSharedModule } from './feature-detail-shared.module';

@NgModule({
	imports: [
		CommonModule,
		FeatureDetailSharedModule,
		LoggerModule.forChild(),
		MaterialModule,
		WorkflowPointDetailModule,
	],
	declarations: [
		AisleDetailComponent,
		CostAreaDetailComponent,
		FeatureComponent,
		FeatureDetailComponent,
		ImpassableAreaDetailComponent,
		KeepOutAreaDetailComponent,
		QueueAreaDetailComponent,
		SpeedLimitAreaDetailComponent,
		StayOnPathAreaDetailComponent,
		WeightedAreaDetailComponent,
		SimulatedObjectDetailComponent,
	],
	providers: [MapStackStateService, NGXLogger],
	exports: [FeatureDetailComponent],
})
export class FeatureDetailModule { }
