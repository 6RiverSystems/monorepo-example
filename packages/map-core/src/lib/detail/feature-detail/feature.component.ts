import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';

import { MapFeature } from '../../interfaces/feature';

/**
 * Not intended to be used directly. Should be extended by individual feature detail components.
 */
@Component({
	selector: 'feature',
	template: '',
})
export class FeatureComponent implements OnDestroy {
	@Input() feature: MapFeature;
	@Input() form: FormGroup;
	/** When true, disable editing of map features. */
	@Input() readOnly = false;

	protected ngUnsubscribe = new Subject();

	constructor(protected fb: FormBuilder, protected ref: ChangeDetectorRef) {}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
