import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';

export class KeepOutArea extends Area {
	constructor(latLngBounds: LatLngBounds, options?: PolylineOptions, name?: string, id?: string) {
		super(LayerType.KeepOutArea, latLngBounds, ['stack-keepout'], options, name, id);
	}
}
