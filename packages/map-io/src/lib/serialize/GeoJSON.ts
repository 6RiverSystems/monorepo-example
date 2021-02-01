/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from './ParseUtils';

export class GeoJSONFeatureCollection {
	constructor(public type: string, public features: GeoJSONFeature[]) {}

	static parse(json: object): GeoJSONFeatureCollection {
		const type: string = ParseUtils.getRequiredField(json, 'type', 'string', 'FeatureCollection');
		const rawFeatures: any = ParseUtils.getRequiredField(json, 'features', 'object');

		const features: GeoJSONFeature[] = [];
		rawFeatures.forEach((rawFeature: object) => {
			const feature: GeoJSONFeature = GeoJSONFeature.parse(rawFeature);
			if (feature !== undefined) {
				features.push(feature);
			}
		});

		return new GeoJSONFeatureCollection(type, features);
	}
}

export class GeoJSONFeature {
	constructor(public type: string, public geometry: GeoJSONGeometry, public properties: any) {}

	static parse(json: object): GeoJSONFeature {
		const type: string = ParseUtils.getRequiredField(json, 'type', 'string', 'Feature');
		const rawGeometry: any = ParseUtils.getRequiredField(json, 'geometry', 'object');
		const properties: any = ParseUtils.getRequiredField(json, 'properties', 'object');

		const geometry = GeoJSONGeometry.parse(rawGeometry);

		return new GeoJSONFeature(type, geometry, properties);
	}
}

export class GeoJSONGeometry {
	constructor(public type: string, public coordinates: any[]) {}

	static parse(json: object): GeoJSONGeometry {
		const type: string = ParseUtils.getRequiredField(json, 'type', 'string');
		const rawCoordinates: any = ParseUtils.getRequiredField(json, 'coordinates', 'object');

		let coordinates: any[] = null;
		if (type === 'Point') {
			coordinates = GeoJSONGeometry.getPoint(rawCoordinates);
		} else if (type === 'LineString') {
			coordinates = GeoJSONGeometry.getLine(rawCoordinates);
		} else if (type === 'Polygon') {
			coordinates = GeoJSONGeometry.getPolygon(rawCoordinates);
		} else {
			throw Error('Unexpected type in geometry');
		}

		return new GeoJSONGeometry(type, coordinates);
	}

	static getPoint(json: any): number[] {
		if (json instanceof Array) {
			const point: number[] = [];
			json.forEach((entry: object) => {
				if (typeof entry !== 'number') {
					throw Error('Expected a number in geometry');
				}
				point.push(entry);
			});
			return point;
		}
		throw Error('Array expected in geometry');
	}

	static getLine(json: any): number[][] {
		if (json instanceof Array) {
			const points: number[][] = [];
			json.forEach((entry: object) => {
				const point: number[] = GeoJSONGeometry.getPoint(entry);
				points.push(point);
			});
			return points;
		}
		throw Error('Array expected in geometry');
	}

	static getPolygon(json: any): number[][][] {
		if (json instanceof Array) {
			const lines: number[][][] = [];
			json.forEach((entry: object) => {
				const line: number[][] = GeoJSONGeometry.getLine(entry);
				lines.push(line);
			});
			return lines;
		}
		throw Error('Array expected in geometry');
	}
}
