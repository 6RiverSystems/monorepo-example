/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from '@sixriver/map-io';
import { GeoJSONFeatureCollection } from '@sixriver/map-io';
import { ConnectivityMatrixSerializer } from '@sixriver/map-io';
import { LogicalAreaCollectionSerializer } from '@sixriver/map-io';
import { WorkflowPointSerializer } from '@sixriver/map-io';
import { AisleSerializer } from '@sixriver/map-io';

import { MapStack } from '../mapstack/MapStack';
import { MapStackFactory } from '../mapstack/MapStackFactory';
import { Aisle } from '../mapstack/Aisle';
import { WorkflowPoint } from '../mapstack/WorkflowPoint';

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

	static fromMapStack(map: MapStack): MapStackSerializer {
		const name: string = map.name;
		const buildNumber: number = map.buildNumber;
		const resolution: number = map.resolution;
		const origin: number[] = map.origin;

		const logical: GeoJSONFeatureCollection = MapStackFactory.createFeatureCollectionFromAreas(
			map.areas,
		);
		const workflowPoints: GeoJSONFeatureCollection = MapStackFactory.createFeatureCollectionFromWorkflowPoints(
			map.workflowPoints,
		);
		const aisles: GeoJSONFeatureCollection = MapStackFactory.createFeatureCollectionFromAisles(
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

	static fromJson(json: object): MapStackSerializer {
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

	toMapStack(occupancyGridImage: HTMLImageElement, occupancyGridBlob: Blob): MapStack {
		const map: MapStack = new MapStack({
			name: this.name,
			buildNumber: this.buildNumber,
			resolution: this.resolution,
			origin: this.origin,
			occupancyGridImage,
			occupancyGridBlob,
		});

		this.logical.features.forEach((feature: any) => {
			const area: any = MapStackFactory.createAreaFromFeature(feature);
			if (area.dragging) {
				area.dragging.disable();
			}
			map.addLayer(area);
		});

		this.workflowPoints.features.forEach((feature: any) => {
			const workflowPoint: WorkflowPoint = MapStackFactory.createWorkflowPointFromFeature(feature);
			if (workflowPoint.dragging) {
				workflowPoint.dragging.disable();
			}
			map.addLayer(workflowPoint);
		});

		this.aisles.features.forEach((feature: any) => {
			const aisle: Aisle = MapStackFactory.createAisleFromFeature(feature);
			if ((aisle as any).dragging) {
				(aisle as any).dragging.disable();
			}
			map.addLayer(aisle);
		});

		map.connectivityMatrix.matrix = this.connectivity.matrix;

		return map;
	}
}
