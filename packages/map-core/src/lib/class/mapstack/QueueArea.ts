import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';

export class QueueArea extends Area {
	public queueName = '';

	constructor(
		latLngBounds: LatLngBounds,
		options?: PolylineOptions,
		queueName?: string,
		name?: string,
		id?: string,
	) {
		super(LayerType.QueueArea, latLngBounds, ['stack-queue'], options, name, id);
		if (queueName) {
			this.queueName = queueName;
		}
	}
}
