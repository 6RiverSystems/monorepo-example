import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { LatLng } from 'leaflet';

import { Aisle } from '../../../class/mapstack/Aisle';
import { FeatureComponent } from '../feature.component';

/**
 * Edit an Aisle
 * @description When editing an Aisle, getLatLngs() wil return a two-dimensional array. The first element of the array
 * is an array containing two LatLngs. The first LatLng is the starting point and the second one is the ending point. If
 * the Aisle is directed, the arrow will be drawn on the ending point.
 */
@Component({
	selector: 'aisle-detail',
	templateUrl: './aisle-detail.component.html',
	styleUrls: ['./aisle-detail.component.scss'],
})
export class AisleDetailComponent extends FeatureComponent implements OnChanges, OnDestroy, OnInit {
	@Input() feature: Aisle;

	ngOnInit() {
		this.form.addControl('directed', this.fb.control(false, Validators.required));
		this.form.addControl('position', this.createControls([]));

		if (this.readOnly) {
			this.form.disable();
		}

		this.updatePanelHooks();
	}

	ngOnChanges() {
		this.updatePanelHooks();
	}

	/**
	 * Connect the feature values to the GUI in the panel
	 */
	private updatePanelHooks() {
		this.form.patchValue({
			directed: this.feature.directed,
		});
		this.form.setControl('position', this.createControls(this.feature.getLatLngs()));
	}

	/**
	 * Convenience accessor for array of position form controls
	 */
	get position(): FormArray {
		return this.form.get('position') as FormArray;
	}

	/**
	 * Create the array of form controls for endpoints, adding the "required" validator for each control
	 */
	private createControls(coordinates: LatLng[] | LatLng[][] | LatLng[][][]) {
		// Trick the compiler into letting the array of coordinates be two-dimensional
		let latLngs: LatLng[];
		if (Array.isArray(coordinates[0])) {
			latLngs = <LatLng[]>coordinates[0];
		} else {
			latLngs = <LatLng[]>coordinates;
		}

		return this.fb.array(
			latLngs.map(coordinate =>
				this.fb.group({
					lat: [coordinate.lat, Validators.required],
					lng: [coordinate.lng, Validators.required],
				}),
			),
		);
	}

	ngOnDestroy() {
		super.ngOnDestroy();

		// Prevent conflicts when changing to another type of feature
		this.form.removeControl('position');
	}
}
