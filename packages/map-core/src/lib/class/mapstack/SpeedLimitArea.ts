import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';
import { MapFeature } from '../../interfaces/feature';

export class SpeedLimitArea extends Area {
	public maxVelocity = 0.7;

	constructor(latLngBounds: LatLngBounds, options?: PolylineOptions, name?: string, id?: string) {
		super(LayerType.SpeedLimitArea, latLngBounds, ['stack-speedlimit'], options, name, id);
	}

	copyFromLayer(layer: MapFeature) {
		super.copyFromLayer(layer);

		this.maxVelocity = (layer as SpeedLimitArea).maxVelocity;
	}
}
