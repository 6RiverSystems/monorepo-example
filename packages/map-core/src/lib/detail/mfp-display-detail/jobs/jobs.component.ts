import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserTask } from '@sixriver/cfs_models';

import { Job } from '../../../interfaces/job';

@Component({
	selector: 'map-core-jobs',
	templateUrl: './jobs.component.html',
	styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent {
	@Input() jobBatches$: Observable<IUserTask[][]>;

	// Store state of expansion panel so it does not close every time the job updates
	jobExpanded: boolean[] = [];

	getJobProgress(batch: Job[]) {
		const totalQuantity = batch.reduce((sum, job) => job.getQuantity(), 0);
		const doneQuantity = batch.reduce((sum, job) => job.getDoneQuantity(), 0);
		return (doneQuantity / totalQuantity) * 100;
	}

	onToggled(isOpen: boolean, i: number) {
		this.jobExpanded[i] = isOpen;
	}
}
