/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from './ParseUtils';
import { GeoJSONFeatureCollection, GeoJSONFeature } from './GeoJSON';

export class WorkflowPointSerializer extends GeoJSONFeatureCollection {
	static loadFromJSON(json: object): WorkflowPointSerializer {
		const areas: WorkflowPointSerializer = GeoJSONFeatureCollection.parse(json);
		return WorkflowPointSerializer.isValid(areas) ? areas : null;
	}

	static isValid(collection: GeoJSONFeatureCollection): boolean {
		let valid = true;

		try {
			collection.features.forEach((workFlow: GeoJSONFeature) => {
				const id: string = ParseUtils.getRequiredField(workFlow, 'properties.id', 'string');
				const type: string = ParseUtils.getRequiredField(workFlow, 'geometry.type', 'string');
				const object: string = ParseUtils.getRequiredField(
					workFlow,
					'properties.object',
					'string',
					'vertex',
				);
				const name: string = ParseUtils.getRequiredField(workFlow, 'properties.name', 'string');
				const labels: any = ParseUtils.getRequiredField(workFlow, 'properties.labels', 'object');
				const orientation: number = ParseUtils.getRequiredField(
					workFlow,
					'properties.orientation',
					'number',
				);
				const workflowOptions: any = ParseUtils.getRequiredField(
					workFlow,
					'properties.workflowOptions',
					'object',
				);

				if (!Array.isArray(labels) || !Array.isArray(workflowOptions)) {
					valid = false;
				}
			});
		} catch (e) {
			console.log(`Error ${e} parsing area`);
			return false;
		}

		return valid;
	}
}
