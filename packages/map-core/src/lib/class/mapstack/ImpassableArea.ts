import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';

export class ImpassableArea extends Area {
	constructor(latLngBounds: LatLngBounds, options?: PolylineOptions, name?: string, id?: string) {
		super(LayerType.ImpassableArea, latLngBounds, ['stack-impassable'], options, name, id);
	}
}
