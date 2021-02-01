import { Component, Input } from '@angular/core';

import { KeepOutArea } from '../../../class/mapstack/KeepOutArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'keep-out-area-detail',
	templateUrl: './keep-out-area-detail.component.html',
	styleUrls: ['./keep-out-area-detail.component.scss'],
})
export class KeepOutAreaDetailComponent extends FeatureComponent {
	@Input() feature: KeepOutArea;
}
