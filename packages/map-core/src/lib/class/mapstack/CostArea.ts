import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';
import { MapFeature } from '../../interfaces/feature';

export class CostArea extends Area {
	public cost = 0;

	constructor(latLngBounds: LatLngBounds, options?: PolylineOptions, name?: string, id?: string) {
		super(LayerType.CostArea, latLngBounds, ['stack-cost'], options, name, id);
	}
	copyFromLayer(layer: MapFeature) {
		super.copyFromLayer(layer);

		this.cost = (layer as CostArea).cost;
	}
}
