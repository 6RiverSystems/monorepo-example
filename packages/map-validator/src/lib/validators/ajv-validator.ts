import Ajv, { ErrorObject } from 'ajv';
import { MapStack } from '@sixriver/map-io';

import aisleSchema from '../schema/aisle.json';
import cellSchema from '../schema/cell.json';
import featureSchema from '../schema/feature.json';
import pointSchema from '../schema/point.json';
import uuidSchema from '../schema/uuid.json';
import workflowPointSchema from '../schema/workflowPoint.json';
import mapStackSchema from '../schema/mapStack.json';
import { Validator, ValidationError } from '../validator';

/**
 * Validates a MapStack json using the Ajv json schema validator.
 * https://github.com/epoberezkin/ajv
 */
export class AjvValidator extends Validator {
	description() {
		return 'Ajv map-stack schema';
	}

	validate(json: MapStack, errors: ValidationError[] = []): boolean {
		const ajv = new Ajv({ allErrors: true, verbose: true });
		const valid = ajv
			.addSchema(
				[
					aisleSchema,
					cellSchema,
					featureSchema,
					pointSchema,
					uuidSchema,
					workflowPointSchema,
					mapStackSchema,
				],
				'https://6river.com/schema/mapStack/mapStack.json',
			)
			.validate('https://6river.com/schema/mapStack/mapStack.json', json);

		if (ajv.errors && ajv.errors.length) {
			errors.push(
				...ajv.errors.map<ValidationError>((error: ErrorObject) => {
					return {
						message: error.message,
						path: error.dataPath,
					};
				}),
			);
		} else {
			errors.length = 0;
		}

		return valid as boolean;
	}
}
