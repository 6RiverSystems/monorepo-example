import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Job } from '../../../interfaces/job';

@Component({
	selector: 'map-core-job',
	templateUrl: './job.component.html',
	styleUrls: ['./job.component.scss'],
})
export class JobComponent {
	@Input() job: Job;
	@Input() index: number;
	@Input() expanded: boolean;
	@Output() toggled: EventEmitter<boolean> = new EventEmitter();

	onOpened() {
		this.toggled.emit(true);
	}

	onClosed() {
		this.toggled.emit(false);
	}
}
