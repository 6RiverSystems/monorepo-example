import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';

export class StayOnPathArea extends Area {
	constructor(latLngBounds: LatLngBounds, options?: PolylineOptions, name?: string, id?: string) {
		super(LayerType.StayOnPathArea, latLngBounds, ['stack-stayonpath'], options, name, id);
	}
}
