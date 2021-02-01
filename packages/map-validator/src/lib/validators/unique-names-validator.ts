import { FeatureCollection, Feature } from 'geojson';
import { MapStack } from '@sixriver/map-io';

import { Validator, ValidationError } from '../validator';

const logicalValidate = ['queue', 'stayOnPath', 'speedLimit'];

/**
 * This will validate that features have names that are unique and not empty.
 * Names are used as lookups in the C++ code and must be unique and not empty.
 * We care about workflowPoints, Aisles, queue Areas and stayOnPath Areas
 **/
class UniqueNamesValidator extends Validator {
	private nameCache: { [key: string]: number[] } = {};
	constructor(private group: 'logical' | 'aisles' | 'workflowPoints') {
		super();
	}

	description() {
		return `Unique names for ${this.group} features`;
	}

	buildNameCache(features: FeatureCollection) {
		features.features.reduce(
			(cache, feature, idx) => (
				(cache[feature.properties.name] = (cache[feature.properties.name] || []).concat([idx])),
				cache
			),
			this.nameCache,
		);
	}

	isNameUniqueAndValid(feature: Feature, idx: number): ValidationError[] {
		const errors: ValidationError[] = [];
		const { type, name } = feature.properties;
		if (!type || logicalValidate.includes(type)) {
			if (name === '') {
				// 1. should not have an empty name
				errors.push({
					message: `Feature ${type ? '(' + type + ') ' : ''}has empty name property`,
					path: `.${this.group}.features[${idx}].properties.name`,
				});
			} else {
				// 2. name should be unique
				if (this.nameCache[name].length > 1) {
					errors.push({
						message: `Feature name (${name}) is not unique${type ? ' type: ' + type : ''}`,
						path: `.${this.group}.features[${idx}].properties.name`,
					});
				}
			}
		}
		return errors;
	}

	validate(json: MapStack, errors: ValidationError[] = []): boolean {
		let isValid = true;
		if (json[this.group]) {
			this.buildNameCache(json[this.group]);
			json[this.group].features.forEach((feature: Feature, idx: number) => {
				const innerErrors = this.isNameUniqueAndValid(feature, idx);
				isValid = isValid && innerErrors.length === 0;
				errors.push(...innerErrors);
			});
		}
		return isValid;
	}
}

export class AislesNameValidator extends UniqueNamesValidator {
	constructor() {
		super('aisles');
	}
}

export class LogicalAreasNameValidator extends UniqueNamesValidator {
	constructor() {
		super('logical');
	}
}

export class WorkflowPointsNameValidator extends UniqueNamesValidator {
	constructor() {
		super('workflowPoints');
	}
}
