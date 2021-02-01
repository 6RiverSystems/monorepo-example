import { LatLng } from 'leaflet';
import { Chance } from 'chance';

/**
 * Get a random LatLng instance
 */
export function getRandomLatLng(chance = new Chance()) {
	return new LatLng(chance.integer({ min: 0 }), chance.integer({ min: 0 }));
}
