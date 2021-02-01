import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { Validators } from '@angular/forms';

import { SpeedLimitArea } from '../../../class/mapstack/SpeedLimitArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'speed-limit-area-detail',
	templateUrl: './speed-limit-area-detail.component.html',
	styleUrls: ['./speed-limit-area-detail.component.scss'],
})
export class SpeedLimitAreaDetailComponent extends FeatureComponent implements OnChanges, OnInit {
	@Input() feature: SpeedLimitArea;

	ngOnInit() {
		this.form.addControl(
			'maxVelocity',
			this.fb.control(
				this.feature.maxVelocity,
				Validators.compose([Validators.required, Validators.min(0)]),
			),
		);

		if (this.readOnly) {
			this.form.disable();
		}
	}

	ngOnChanges() {
		this.form.patchValue({ maxVelocity: this.feature.maxVelocity });
	}
}
