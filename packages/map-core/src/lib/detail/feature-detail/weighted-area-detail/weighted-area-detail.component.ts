import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { Validators } from '@angular/forms';

import { WeightedArea } from '../../../class/mapstack/WeightedArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'weighted-area-detail',
	templateUrl: './weighted-area-detail.component.html',
	styleUrls: ['./weighted-area-detail.component.scss'],
})
export class WeightedAreaDetailComponent extends FeatureComponent implements OnChanges, OnInit {
	@Input() feature: WeightedArea;

	ngOnInit() {
		const validators = [Validators.required, Validators.min(0), Validators.max(255)];
		this.form.addControl(
			'weights',
			this.fb.group({
				east: [this.feature.weights.east, validators],
				north: [this.feature.weights.north, validators],
				northEast: [this.feature.weights.northEast, validators],
				northWest: [this.feature.weights.northWest, validators],
				south: [this.feature.weights.south, validators],
				southEast: [this.feature.weights.southEast, validators],
				southWest: [this.feature.weights.southWest, validators],
				west: [this.feature.weights.west, validators],
			}),
		);

		if (this.readOnly) {
			this.form.disable();
		}
	}

	ngOnChanges() {
		this.form.patchValue({ weights: this.feature.weights });
	}
}
