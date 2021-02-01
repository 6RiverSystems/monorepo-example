/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { GeoJSONFeatureCollection, GeoJSONFeature } from './GeoJSON';
import { LogicalAreaSerializer } from './LogicalAreaSerializer';

export class LogicalAreaCollectionSerializer extends GeoJSONFeatureCollection {
	static loadFromJSON(json: object): LogicalAreaCollectionSerializer {
		const areas: LogicalAreaCollectionSerializer = GeoJSONFeatureCollection.parse(json);
		return LogicalAreaCollectionSerializer.isValid(areas) ? areas : null;
	}

	static isValid(collection: GeoJSONFeatureCollection): boolean {
		let valid = true;
		collection.features.forEach((area: GeoJSONFeature) => {
			if (!LogicalAreaSerializer.isValid(area)) {
				valid = false;
			}
		});
		return valid;
	}
}
