/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from './ParseUtils';
import { GeoJSONFeatureCollection } from './GeoJSON';
import { ConnectivityMatrixSerializer } from './ConnectivityMatrixSerializer';
import { LogicalAreaCollectionSerializer } from './LogicalAreaCollectionSerializer';
import { WorkflowPointSerializer } from './WorkflowPointSerializer';
import { AisleSerializer } from './AisleSerializer';
import { MapStackFactory } from './map-stack-factory';
import { MapStackData } from '../interfaces/map-stack';
import { ConnectivityMatrix } from '../interfaces/connectivity-matrix';
import { MapStack } from '../interfaces/map-stack-json';

const LANGUAGE_VERSION = '2.0.0';

export class MapStackSerializer {
	constructor(
		public languageVersion: string,
		public name: string,
		public buildNumber: number,
		public resolution: number,
		public origin: number[],
		public metadata: any,
		public logical: GeoJSONFeatureCollection,
		public workflowPoints: GeoJSONFeatureCollection,
		public aisles: GeoJSONFeatureCollection,
		public connectivity: ConnectivityMatrixSerializer,
	) {}

	static fromMapStack(map: MapStackData): MapStackSerializer {
		const name: string = map.name;
		const buildNumber: number = map.buildNumber;
		const resolution: number = map.resolution;
		const origin: number[] = map.origin;

		const logical: GeoJSONFeatureCollection = MapStackFactory.createFeatureCollectionFromMapObjects(
			map.areas,
		);
		const workflowPoints: GeoJSONFeatureCollection = MapStackFactory.createFeatureCollectionFromMapObjects(
			map.workflowPoints,
		);
		const aisles: GeoJSONFeatureCollection = MapStackFactory.createFeatureCollectionFromMapObjects(
			map.aisles,
		);
		const connectivity: ConnectivityMatrixSerializer = ConnectivityMatrixSerializer.loadFromJSON(
			map.connectivityMatrix,
		);

		return new MapStackSerializer(
			LANGUAGE_VERSION,
			name,
			buildNumber,
			resolution,
			origin,
			{},
			logical,
			workflowPoints,
			aisles,
			connectivity,
		);
	}

	static fromString(msjson: string): MapStackSerializer {
		const json = JSON.parse(msjson);
		return MapStackSerializer.fromJson(json);
	}

	static fromJson(json: MapStack): MapStackSerializer {
		try {
			const languageVersion: string = ParseUtils.getRequiredField(
				json,
				'languageVersion',
				'string',
			);
			const name: string = ParseUtils.getRequiredField(json, 'name', 'string');
			const buildNumber: number = ParseUtils.getRequiredField(json, 'buildNumber', 'number');
			const resolution: number = ParseUtils.getRequiredField(json, 'resolution', 'number');
			const origin: number[] = ParseUtils.getRequiredField(json, 'origin', 'object');
			const metadata: any = ParseUtils.getRequiredField(json, 'metadata', 'object');

			const rawLogical: object = ParseUtils.getRequiredField(json, 'logical', 'object');
			const rawWorkflowPoints: object = ParseUtils.getRequiredField(
				json,
				'workflowPoints',
				'object',
			);
			const rawAisles: object = ParseUtils.getRequiredField(json, 'aisles', 'object');
			const rawConnectivity: object = ParseUtils.getRequiredField(json, 'connectivity', 'object');

			const logical: GeoJSONFeatureCollection = LogicalAreaCollectionSerializer.loadFromJSON(
				rawLogical,
			);
			const workflowPoints: GeoJSONFeatureCollection = WorkflowPointSerializer.loadFromJSON(
				rawWorkflowPoints,
			);
			const aisles: GeoJSONFeatureCollection = AisleSerializer.loadFromJSON(rawAisles);
			const connectivity: ConnectivityMatrixSerializer = ConnectivityMatrixSerializer.loadFromJSON(
				rawConnectivity,
			);

			return new MapStackSerializer(
				languageVersion,
				name,
				buildNumber,
				resolution,
				origin,
				metadata,
				logical,
				workflowPoints,
				aisles,
				connectivity,
			);
		} catch (e) {
			console.log(`${e} - parsing JSON object`);
			throw e;
		}
	}

	toString(): string {
		return JSON.stringify(this, undefined, 2);
	}

	toMapStack(): MapStackData {
		const mapStackData = <MapStackData>{
			type: 'map-stack-data',
			name: this.name,
			buildNumber: this.buildNumber,
			resolution: this.resolution,
			origin: this.origin,
			areas: this.logical.features.map((feature: any) =>
				MapStackFactory.createAreaFromFeature(feature),
			),
			workflowPoints: this.workflowPoints.features.map((feature: any) =>
				MapStackFactory.createWorkflowPointFromFeature(feature),
			),
			aisles: this.aisles.features.map((feature: any) =>
				MapStackFactory.createAisleFromFeature(feature),
			),
			connectivityMatrix: this.connectivity,
		};

		return mapStackData;
	}
}
