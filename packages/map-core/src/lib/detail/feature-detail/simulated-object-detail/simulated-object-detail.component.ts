import { Component, Input } from '@angular/core';

import { SimulatedObject } from '../../../class/mapstack/SimulatedObject';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'simulated-object-detail',
	templateUrl: './simulated-object-detail.component.html',
	styleUrls: ['./simulated-object-detail.component.scss'],
})
export class SimulatedObjectDetailComponent extends FeatureComponent {
	@Input() feature: SimulatedObject;
}
