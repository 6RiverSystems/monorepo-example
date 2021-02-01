import { PolylineOptions, LatLngBounds } from 'leaflet';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';
import { MapFeature } from '../../interfaces/feature';

export class WeightCosts {
	north = 0;
	northEast = 0;
	east = 0;
	southEast = 0;
	south = 0;
	southWest = 0;
	west = 0;
	northWest = 0;
}

export class WeightedArea extends Area {
	public weights: WeightCosts = new WeightCosts();

	constructor(
		latLngBounds: LatLngBounds,
		options?: PolylineOptions,
		name?: string,
		id?: string,
		weights?: WeightCosts,
	) {
		super(LayerType.WeightedArea, latLngBounds, ['stack-weighted'], options, name, id);

		if (weights) {
			this.weights = weights;
		}
		// Set the style.
		this.setWeightStyle();
	}

	private setWeightStyle() {
		const cardinals = ['north', 'south', 'east', 'west'];
		cardinals.forEach(cd => this.classNameUpdater.removeClass('stack-weighted-' + cd));

		const cardinal: string = cardinals.reduce((a, cd) => (this.weights[cd] > 0 ? (a = cd) : a));
		this.classNameUpdater.addClass('stack-weighted' + (cardinal ? '-' + cardinal : ''));
	}

	copyFromLayer(layer: MapFeature) {
		super.copyFromLayer(layer);

		this.weights = (layer as WeightedArea).weights;
		this.setWeightStyle();
	}
}
