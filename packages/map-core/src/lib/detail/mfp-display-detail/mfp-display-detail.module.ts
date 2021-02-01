import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';
import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './job/job.component';
import { MfpDisplayDetailComponent } from './mfp-display-detail.component';

@NgModule({
	imports: [CommonModule, MaterialModule],
	exports: [MfpDisplayDetailComponent],
	declarations: [JobComponent, JobsComponent, MfpDisplayDetailComponent],
})
export class MfpDisplayDetailModule {}
