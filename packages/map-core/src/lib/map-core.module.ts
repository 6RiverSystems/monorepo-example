import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { LeafletDirective } from './directives/leaflet.directive';
import { MapStackEditorDirective } from './directives/map-stack-editor.directive';
import { ConnectivityMatrixService } from './services/connectivity-matrix.service';
import { WorkflowPointService } from './services/workflow-point.service';
import { MapStackService } from './services/map-stack.service';
import { MapStackStateService } from './services/map-stack-state.service';
import { MfpWorkflowService } from './services/mfp-work.service';
import { MfpsService } from './services/mfps.service';
import { MfpsLogDnaService } from './services/mfps-log-dna.service';
import { SiteService } from './services/site.service';
import { UsersService } from './services/users.service';
import { SelectionService } from './services/selection.service';
import { SiteMapComponent } from './site-map/site-map.component';
import { MapCoreComponent } from './map-core.component';
import { DetailModule } from './detail/detail.module';
import { NotificationService } from './services/notification.service';
import { NotificationComponent } from './notification/notification.component';
import { MaterialModule } from './material.module';
import { mapCoreReducers, mapCoreMetaReducers } from './reducers/index';
import { SpinnerModule } from './spinner/spinner.module';
import { DisplayOptionsService } from './services/display-options.service';
import { SimulatedObjectService } from './services/simulated-object.service';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		DetailModule,
		SpinnerModule,
		MaterialModule,
		StoreModule.forRoot(mapCoreReducers, {
			metaReducers: mapCoreMetaReducers,
			runtimeChecks: {
				strictStateImmutability: false,
				strictActionImmutability: false,
			},
		}),
	],
	declarations: [
		LeafletDirective,
		MapStackEditorDirective,
		SiteMapComponent,
		MapCoreComponent,
		NotificationComponent,
	],
	entryComponents: [NotificationComponent],
	providers: [
		ConnectivityMatrixService,
		WorkflowPointService,
		MapStackService,
		DisplayOptionsService,
		MapStackStateService,
		MfpsService,
		MfpsLogDnaService,
		MfpWorkflowService,
		SiteService,
		UsersService,
		SelectionService,
		NotificationService,
		SimulatedObjectService,
	],
	exports: [SiteMapComponent, MapCoreComponent, DetailModule],
})
export class MapCoreModule { }
