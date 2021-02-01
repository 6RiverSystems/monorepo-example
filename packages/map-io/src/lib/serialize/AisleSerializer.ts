/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from './ParseUtils';
import { GeoJSONFeatureCollection, GeoJSONFeature } from './GeoJSON';

export class AisleSerializer extends GeoJSONFeatureCollection {
	static loadFromJSON(json: object): AisleSerializer {
		const areas: AisleSerializer = GeoJSONFeatureCollection.parse(json);
		return AisleSerializer.isValid(areas) ? areas : null;
	}

	static isValid(collection: GeoJSONFeatureCollection): boolean {
		let valid = true;

		try {
			collection.features.forEach((workFlow: GeoJSONFeature) => {
				const id: string = ParseUtils.getRequiredField(workFlow, 'properties.id', 'string');
				const type: string = ParseUtils.getRequiredField(
					workFlow,
					'geometry.type',
					'string',
					'LineString',
				);
				const object: string = ParseUtils.getRequiredField(
					workFlow,
					'properties.object',
					'string',
					'aisle',
				);
				const name: string = ParseUtils.getRequiredField(workFlow, 'properties.name', 'string');
				const coordinates: object[] = ParseUtils.getRequiredField(
					workFlow,
					'geometry.coordinates',
					'object',
				);
				const directed: number = ParseUtils.getRequiredField(
					workFlow,
					'properties.directed',
					'boolean',
				);

				if (coordinates.length !== 2) {
					console.log(`Invalid number of coordinates '${coordinates.length}' for aisle`);
					valid = false;
				}
			});
		} catch (e) {
			console.log(`Error ${e} parsing aisle`);
			return false;
		}

		return valid;
	}
}
