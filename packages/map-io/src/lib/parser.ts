import { MapStackData } from './interfaces/map-stack';
import { MapStackSerializer } from './serialize/MapStackSerializer';
import { MapStack } from './interfaces/map-stack-json';

/**
 * Parses a MapStack json extracted from a 6rms file.
 */
export function parse(json: MapStack): MapStackData {
	const serializer = MapStackSerializer.fromJson(json);
	const data: MapStackData = serializer.toMapStack();

	return data;
}
