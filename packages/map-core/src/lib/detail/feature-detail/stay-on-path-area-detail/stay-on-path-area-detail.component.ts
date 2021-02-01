import { Component, Input } from '@angular/core';

import { StayOnPathArea } from '../../../class/mapstack/StayOnPathArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'stay-on-path-area-detail',
	templateUrl: './stay-on-path-area-detail.component.html',
	styleUrls: ['./stay-on-path-area-detail.component.scss'],
})
export class StayOnPathAreaDetailComponent extends FeatureComponent {
	@Input() feature: StayOnPathArea;
}
