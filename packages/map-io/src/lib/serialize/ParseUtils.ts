/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { get } from 'lodash-es';

export class ParseUtils {
	static getRequiredField(json: object, field: string, type: string, expected?: string): any {
		const value: any = get(json, field);
		if (value === null || value === undefined) {
			throw Error(`required field '${field}' not found`);
		}
		if (typeof value !== type) {
			throw Error(`bad type '${typeof value}' for field '${field}' - expected '${type}'`);
		}
		if (expected !== undefined && value !== expected) {
			throw Error(`bad value '${value}' for field '${field}' - expected '${expected}'`);
		}
		return value;
	}
}
