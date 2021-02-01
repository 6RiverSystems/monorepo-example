import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { LatLngBounds } from 'leaflet';

import { FeatureComponent } from '../feature.component';

/**
 * Edit the position of an Area feature.
 * @description When editing the position of an Area, it is only necessary to edit two opposite corners. Editing all
 * four corners would be redundant because each corner shares one value with another corner. Since Area extends
 * Rectangle, the `LatLngBounds` of the feature can be used to retrieve two opposite corners. `setBounds` can be used to
 * update the position with the new value when the form is submitted.
 */
@Component({
	selector: 'map-core-area-position-editor',
	templateUrl: './area-position-editor.component.html',
	styleUrls: ['./area-position-editor.component.scss'],
})
export class AreaPositionEditorComponent extends FeatureComponent
	implements OnChanges, OnDestroy, OnInit {
	@Input() position: LatLngBounds;

	ngOnInit() {
		this.form.addControl(
			'position',
			this.fb.group({
				southWest: this.fb.group({
					lat: this.position.getSouthWest().lat,
					lng: this.position.getSouthWest().lng,
				}),
				northEast: this.fb.group({
					lat: this.position.getNorthEast().lat,
					lng: this.position.getNorthEast().lng,
				}),
			}),
		);

		if (this.readOnly) {
			this.form.disable();
		}
	}

	ngOnChanges() {
		this.form.patchValue({
			position: {
				southWest: {
					lat: this.position.getSouthWest().lat,
					lng: this.position.getSouthWest().lng,
				},
				northEast: {
					lat: this.position.getNorthEast().lat,
					lng: this.position.getNorthEast().lng,
				},
			},
		});
	}

	ngOnDestroy() {
		super.ngOnDestroy();

		// Prevent conflicts when changing to another type of feature
		this.form.removeControl('position');
	}
}
