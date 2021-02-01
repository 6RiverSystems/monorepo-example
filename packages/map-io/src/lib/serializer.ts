import { MapStackData } from './interfaces/map-stack';
import { MapStackSerializer } from './serialize/MapStackSerializer';

/**
 * Serializes a MapStack json based on the 6rms file format.
 */
export function serialize(mapStack: MapStackData): string {
	const serializer = MapStackSerializer.fromMapStack(mapStack);
	const json = serializer.toString();

	return json;
}
