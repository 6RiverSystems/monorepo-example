import { Component, Input } from '@angular/core';

import { QueueArea } from '../../../class/mapstack/QueueArea';
import { FeatureComponent } from '../feature.component';

@Component({
	selector: 'queue-area-detail',
	templateUrl: './queue-area-detail.component.html',
	styleUrls: ['./queue-area-detail.component.scss'],
})
export class QueueAreaDetailComponent extends FeatureComponent {
	@Input() feature: QueueArea;
}
