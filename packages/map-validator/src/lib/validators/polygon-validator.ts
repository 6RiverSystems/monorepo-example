import { Feature, Polygon } from 'geojson';
import { MapStack } from '@sixriver/map-io';

import { Validator, ValidationError } from '../validator';

/** This will validate that logical areas have valid rectangle polygons */
export class PolygonValidator extends Validator {
	description() {
		return 'Rectangle polygon validation';
	}

	validatePolygon(idx: number, feature: Feature, input: number[][][]): ValidationError[] {
		const errors: ValidationError[] = [];
		if (input.length !== 1 || input[0].length !== 5) {
			errors.push({
				message: 'Not a well formated geojson Polygon',
				path: `.logical.features[${idx}].geometry.coordinates`,
			});
		} else {
			// check that the polygon closes
			const points: number[][] = input[0];
			if (points[0].toString() !== points[4].toString()) {
				errors.push({
					message: 'Rect Polygon does not close properly',
					path: `.logical.features[${idx}].geometry.coordinates`,
				});
			}
			// check that the polygon has a width and height
			const width = Math.abs(points[0][0] - points[2][0]);
			if (width <= 0.025) {
				errors.push({
					message: 'Invalid rectangle polygon width: ' + width,
					path: `.logical.features[${idx}].geometry.coordinates`,
				});
			}
			const height = Math.abs(points[0][1] - points[2][1]);
			if (height <= 0.025) {
				errors.push({
					message: 'Invalid rectangle polygon height: ' + height,
					path: `.logical.features[${idx}].geometry.coordinates`,
				});
			}
		}
		return errors;
	}

	validate(json: MapStack, errors: ValidationError[]): boolean {
		let isValid = true;
		if (json.logical) {
			json.logical.features.forEach((feature: Feature<Polygon>, idx) => {
				const innerErrors = this.validatePolygon(idx, feature, feature.geometry.coordinates);
				errors.push(...innerErrors);
				isValid = isValid && errors.length === 0;
			});
		}
		return isValid;
	}
}
