import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureDetailModule } from './feature-detail/feature-detail.module';
import { MfpDisplayDetailModule } from './mfp-display-detail/mfp-display-detail.module';
import { DetailComponent } from './detail.component';
import { MaterialModule } from '../material.module';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		FeatureDetailModule,
		MfpDisplayDetailModule,
		SpinnerModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [DetailComponent],
	declarations: [DetailComponent],
})
export class DetailModule {}
