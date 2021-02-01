import { Map } from 'leaflet';

import { LeafletDirective } from './leaflet.directive';
import { MapStack } from '../class/mapstack/MapStack';

export class LeafletDirectiveWrapper {
	// Reference to the main leaflet directive
	protected leafletDirective: LeafletDirective;

	constructor(leafletDirective: LeafletDirective) {
		this.leafletDirective = leafletDirective;
	}

	init() {
		// Nothing for now
	}

	getMap(): Map {
		return this.leafletDirective.getMap();
	}

	getMapStack(): MapStack {
		return this.leafletDirective.getMapStack();
	}
}
