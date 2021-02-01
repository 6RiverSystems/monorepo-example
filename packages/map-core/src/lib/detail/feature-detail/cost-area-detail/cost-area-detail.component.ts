import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { Validators } from '@angular/forms';

import { CostArea } from '../../../class/mapstack/CostArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'cost-area-detail',
	templateUrl: './cost-area-detail.component.html',
	styleUrls: ['./cost-area-detail.component.scss'],
})
export class CostAreaDetailComponent extends FeatureComponent implements OnChanges, OnInit {
	@Input() feature: CostArea;

	ngOnInit() {
		this.form.addControl(
			'cost',
			this.fb.control(
				this.feature.cost,
				Validators.compose([Validators.required, Validators.min(0), Validators.max(255)]),
			),
		);

		if (this.readOnly) {
			this.form.disable();
		}
	}

	ngOnChanges() {
		this.form.patchValue({ cost: this.feature.cost });
	}
}
