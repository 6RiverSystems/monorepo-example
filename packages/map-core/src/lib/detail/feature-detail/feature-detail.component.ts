import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	EventEmitter,
	Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash-es';
import { Store } from '@ngrx/store';
import { LatLngBounds, Layer } from 'leaflet';

import { MapFeature } from '../../interfaces/feature';
import { LayerType } from '../../interfaces/layer';
import { MapStackStateService } from '../../services/map-stack-state.service';
import { MapCoreState } from '../../reducers';
import { DetailClose } from '../detail.actions';
import { Aisle } from '../../class/mapstack/Aisle';
import { Area } from '../../class/mapstack/Area';
import { QueueArea } from '../../class/mapstack/QueueArea';
import { StayOnPathArea } from '../../class/mapstack/StayOnPathArea';
import { WorkflowPoint } from '../../class/mapstack/WorkflowPoint';

@Component({
	selector: 'map-core-feature-detail',
	templateUrl: './feature-detail.component.html',
	styleUrls: ['./feature-detail.component.scss'],
})
export class FeatureDetailComponent implements OnChanges, OnDestroy, OnInit {
	@Input() feature: MapFeature;
	/** When true, disable editing of map features. */
	@Input() readOnly = false;
	@Output() closeDetails = new EventEmitter();
	form: FormGroup;
	unsubscribe = false;

	constructor(
		private fb: FormBuilder,
		private mapStackStateService: MapStackStateService,
		private store: Store<MapCoreState>,
	) { }

	ngOnInit() {
		this.form = this.fb.group({
			name: this.feature.name,
		});

		if (this.readOnly === true) {
			this.form.disable();
		}

		this.updateValidators();
	}

	ngOnChanges() {
		if (this.form) {
			this.form.patchValue({ name: this.feature.name });
			this.updateValidators();
		}
	}

	updateValidators() {
		// Name is a required property on aisles
		if (
			this.feature instanceof Aisle ||
			this.feature instanceof WorkflowPoint ||
			this.feature instanceof QueueArea ||
			this.feature instanceof StayOnPathArea
		) {
			this.form.get('name').setValidators(Validators.required);
		} else {
			this.form.get('name').setValidators(Validators.nullValidator);
		}
	}

	get type(): LayerType {
		if (this.feature) {
			return this.feature.type;
		}
		return null;
	}
	/**
	 * Update value in the map stack state
	 */
	onSubmit() {
		// If position property is set, use its value to update the feature's position and remove it
		if (this.form.value.position) {
			if (this.feature instanceof Area) {
				const bounds = new LatLngBounds(
					this.form.value.position.southWest,
					this.form.value.position.northEast,
				);
				this.feature.setBounds(bounds);
			} else if (this.feature instanceof Aisle) {
				this.feature.setLatLngs(this.form.value.position);
			}
		}

		// trim white spaces from names
		this.form.value.name = this.form.value.name.trim();
		// Merge form value into the map feature, deep cloning the value to remove all form references
		Object.assign(this.feature, cloneDeep(this.form.value));
		this.mapStackStateService.edit([this.feature]);
	}

	/**
	 * Remove the feature from the map stack and close the detail component
	 */
	onRemove() {
		if (this.feature.type !== LayerType.SimulatedObject) {
			this.mapStackStateService.remove(this.feature);
		}
		this.store.dispatch(new DetailClose());
	}

	ngOnDestroy() {
		this.unsubscribe = true;
	}
}
