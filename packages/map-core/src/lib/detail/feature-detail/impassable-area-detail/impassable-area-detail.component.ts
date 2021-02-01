import { Component, Input } from '@angular/core';

import { ImpassableArea } from '../../../class/mapstack/ImpassableArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'impassable-area-detail',
	templateUrl: './impassable-area-detail.component.html',
	styleUrls: ['./impassable-area-detail.component.scss'],
})
export class ImpassableAreaDetailComponent extends FeatureComponent {
	@Input() feature: ImpassableArea;
}
