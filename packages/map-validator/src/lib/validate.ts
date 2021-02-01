import { MapStack } from '@sixriver/map-io';
import { get, toPath } from 'lodash-es';
import { Feature } from 'geojson';

import { validators } from './validators';
import { ValidationError } from './validator';

/**
 * Validates a MapStack json.
 */
export function validate(json: MapStack, errors: ValidationError[] = []): boolean {
	let isValid = true;
	errors.length = 0;
	validators.forEach(Validator => {
		const validatorErrors = [];
		const validator = new Validator();
		try {
			isValid = validator.validate(json, validatorErrors) && isValid;
			errors.push(...validatorErrors);
		} catch (err) {
			isValid = false;
			errors.push({
				message: `An exception occurred in the validator "${validator.description()}": ${err}`,
				path: '',
			});
		}
	});
	decorateErrors(json, errors);

	return isValid;
}

/**
 * Decorate the errors with additional information
 */
function decorateErrors(mapStack: MapStack, errors: ValidationError[]) {
	errors.forEach(e => {
		const path = toPath(e.path.substr(1)); // remove the prefixed '.' and convert to a path array
		while (path.length) {
			const obj = get(mapStack, path);
			if (obj.hasOwnProperty('type') && obj.type === 'Feature') {
				const feature: Feature = obj;
				e.id = feature.properties.id;
				e.ref = obj;
			}
			path.pop();
		}
	});
}
