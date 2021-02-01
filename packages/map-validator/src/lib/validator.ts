import { MapStack, GeoJSONFeature } from '@sixriver/map-io';

export interface ValidationError {
	/** Path to the property generated the error */
	path: string;
	/** Error message */
	message: string;
	/** Map Stack object uuid */
	id?: string;
	/** Reference to invalid Geo JSON object */
	ref?: GeoJSONFeature;
}

export abstract class Validator {
	/** A brief description of what this validator checks */
	abstract description(): string;
	abstract validate(json: MapStack, errors: ValidationError[]): boolean;
}
