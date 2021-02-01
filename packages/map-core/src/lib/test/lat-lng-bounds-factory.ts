import { LatLngBounds } from 'leaflet';
import { Chance } from 'chance';

import { getRandomLatLng } from './lat-lng-factory';

/**
 * Get a random LatLngBounds instance
 */
export function getRandomLatLngBounds(chance = new Chance()) {
	return new LatLngBounds(getRandomLatLng(chance), getRandomLatLng(chance));
}
