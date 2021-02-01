import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, pluck, takeUntil } from 'rxjs/operators';
import { Feature, SubmitEvent } from '@sixriver/map-inspector';

import { Layer, LayerType } from '../interfaces/layer';
import { MfpDisplay } from '../class/mapstack/MfpDisplay';
import { MapCoreState } from '../reducers';
import { DetailClose } from './detail.actions';
import { clone } from '../class/mapstack/clone';
import { DisplayOptionsService } from '../services/display-options.service';
import { DisplayOptions } from '../interfaces/map-display-options';
import '@sixriver/map-inspector';
import { layerToFeature } from '../class/mapstack/layerToFeature';
import { MapStackStateService } from '../services/map-stack-state.service';
import { featureToLayer } from '../class/mapstack/featureToLayer';

@Component({
	selector: 'site-map-detail',
	templateUrl: 'detail.component.html',
	styleUrls: ['detail.component.scss'],
})
export class DetailComponent implements OnDestroy, OnInit {
	/** When true, disable editing of map features. */
	public readOnly = false;

	@Input() nextMode = false;
	@Input() features;
	@Input() layer: Layer;
	isMfp: boolean;
	private ngUnsubscribe = new Subject();

	constructor(
		private store: Store<MapCoreState>,
		private displayOptionsService: DisplayOptionsService,
		private mapStackStateService: MapStackStateService,
	) {
		// Subscribe to the layer state and update the local copy of it when it changes
		this.store
			.pipe(
				select('detail'),
				// Must use pluck because select memoizes arguments, preventing change detection when used with objects
				pluck('layers'),
				// Filter out invalid values
				filter(l => l.length > 0),
				takeUntil(this.ngUnsubscribe),
			)
			.subscribe((layers: Layer[]) => {
				if (this.nextMode) {
					this.features = layers.map(layer => layerToFeature(layer));
				} else {
					const layer = layers[0];
					if (layer.type === LayerType.SimulatedObject) {
						this.readOnly = true;
					} else {
						this.readOnly = !this.displayOptionsService.canEdit(layer.type);
					}
					this.isMfp = layer instanceof MfpDisplay;
					this.layer = this.isMfp ? layer : clone(layer);
				}
			});
	}

	@HostListener('inspector-event', ['$event'])
	onSubmit(event: CustomEvent<SubmitEvent>) {
		const features: Feature[] = event.detail.features;
		const layers = features.map(feature => featureToLayer(feature));
		this.mapStackStateService.edit(layers as any);
	}

	ngOnInit() {
		if (this.displayOptionsService.get(DisplayOptions.NextMode)) {
			this.nextMode = true;
		}
	}
	/**
	 * Handle sidenav close events
	 */
	onClose() {
		this.store.dispatch(new DetailClose());
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
