import { LatLngBounds, LatLng } from 'leaflet';
import { GeoJSONGeometry, GeoJSONFeature, GeoJSONFeatureCollection } from '@sixriver/map-io';

import { ImpassableArea } from './ImpassableArea';
import { QueueArea } from './QueueArea';
import { SpeedLimitArea } from './SpeedLimitArea';
import { StayOnPathArea } from './StayOnPathArea';
import { WeightedArea, WeightCosts } from './WeightedArea';
import { KeepOutArea } from './KeepOutArea';
import { CostArea } from './CostArea';
import { Area } from './Area';
import { Aisle } from './Aisle';
import { Pose } from '../../interfaces/pose';
import { LayerType } from '../../interfaces/layer';
import { WorkflowPoint } from './WorkflowPoint';

export class MapStackFactory {
	static createBoundsFromGeometry(geometry: GeoJSONGeometry): LatLngBounds {
		const southWest: number[] = geometry.coordinates[0][0];
		const northEast: number[] = geometry.coordinates[0][2];
		const bounds: LatLngBounds = new LatLngBounds(
			[southWest[1], southWest[0]],
			[northEast[1], northEast[0]],
		);
		return bounds;
	}

	static createAreaFromFeature(feature: GeoJSONFeature): Area {
		const defaultOptions: any = {};
		if (feature.properties.type === LayerType.ImpassableArea) {
			return new ImpassableArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.name,
				feature.properties.id,
			);
		} else if (feature.properties.type === LayerType.QueueArea) {
			return new QueueArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.queueName,
				feature.properties.name,
				feature.properties.id,
			);
		} else if (feature.properties.type === LayerType.SpeedLimitArea) {
			const area: SpeedLimitArea = new SpeedLimitArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.name,
				feature.properties.id,
			);
			area.maxVelocity = feature.properties.maxVelocity;
			return area;
		} else if (feature.properties.type === LayerType.StayOnPathArea) {
			return new StayOnPathArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.name,
				feature.properties.id,
			);
		} else if (feature.properties.type === LayerType.WeightedArea) {
			const weights: WeightCosts = {
				north: feature.properties.n,
				northEast: feature.properties.ne,
				east: feature.properties.e,
				southEast: feature.properties.se,
				south: feature.properties.s,
				southWest: feature.properties.sw,
				west: feature.properties.w,
				northWest: feature.properties.nw,
			};
			const area: WeightedArea = new WeightedArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.name,
				feature.properties.id,
				weights,
			);
			return area;
		} else if (feature.properties.type === LayerType.KeepOutArea) {
			return new KeepOutArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.name,
				feature.properties.id,
			);
		} else if (feature.properties.type === LayerType.CostArea) {
			const area: CostArea = new CostArea(
				MapStackFactory.createBoundsFromGeometry(feature.geometry),
				defaultOptions,
				feature.properties.name,
				feature.properties.id,
			);
			area.cost = feature.properties.cost;
			return area;
		}
		return null;
	}

	static createWorkflowPointFromFeature(feature: GeoJSONFeature): WorkflowPoint {
		const defaultOptions: any = { interactive: true, pane: 'shadowPane' };
		const pose: Pose = new Pose(
			feature.geometry.coordinates[0],
			feature.geometry.coordinates[1],
			feature.properties.orientation,
		);
		const workflowPoint: WorkflowPoint = new WorkflowPoint(
			pose,
			defaultOptions,
			feature.properties.id,
		);
		workflowPoint.name = feature.properties.name;
		workflowPoint.labels = feature.properties.labels;
		workflowPoint.workflowOptions = feature.properties.workflowOptions;
		return workflowPoint;
	}

	static createAisleFromFeature(feature: GeoJSONFeature): Aisle {
		const defaultOptions: any = { pane: 'aislePane' };
		const start: LatLng = new LatLng(
			feature.geometry.coordinates[0][1],
			feature.geometry.coordinates[0][0],
		);
		const end: LatLng = new LatLng(
			feature.geometry.coordinates[1][1],
			feature.geometry.coordinates[1][0],
		);
		const aisle: Aisle = new Aisle(
			[start, end],
			defaultOptions,
			feature.properties.name,
			feature.properties.id,
		);
		aisle.name = feature.properties.name;
		aisle.directed = feature.properties.directed;
		aisle.labels = feature.properties.labels;
		return aisle;
	}

	static createFeatureFromArea(area: Area): GeoJSONFeature {
		const geometry: GeoJSONGeometry = area.toGeoJSON().geometry;
		const properties: any = {
			name: area.name,
			id: area.id,
			type: area.type,
		};
		if (area.type === 'speedLimit') {
			const speedLimitArea: SpeedLimitArea = area as SpeedLimitArea;
			properties.maxVelocity = speedLimitArea.maxVelocity;
		} else if (area.type === 'weightedArea') {
			const weightedArea: WeightedArea = area as WeightedArea;
			properties.n = weightedArea.weights.north;
			properties.ne = weightedArea.weights.northEast;
			properties.e = weightedArea.weights.east;
			properties.se = weightedArea.weights.southEast;
			properties.s = weightedArea.weights.south;
			properties.sw = weightedArea.weights.southWest;
			properties.w = weightedArea.weights.west;
			properties.nw = weightedArea.weights.northWest;
		} else if (area.type === 'costArea') {
			const costArea: CostArea = area as CostArea;
			properties.cost = costArea.cost;
		} else if (area.type === 'queue') {
			const queueArea: QueueArea = area as QueueArea;
			properties.queueName = queueArea.queueName;
		}
		return new GeoJSONFeature('Feature', geometry, properties);
	}

	static createFeatureFromWorkflowPoint(workflowPoint: WorkflowPoint): GeoJSONFeature {
		const geometry: GeoJSONGeometry = workflowPoint.toGeoJSON().geometry;
		const properties: any = {
			object: 'vertex',
			name: workflowPoint.name,
			id: workflowPoint.id,
			orientation: workflowPoint.pose.orientation,
			labels: workflowPoint.labels,
			workflowOptions: workflowPoint.workflowOptions,
		};
		return new GeoJSONFeature('Feature', geometry, properties);
	}

	static createFeatureFromAisle(aisle: Aisle): GeoJSONFeature {
		const geometry: GeoJSONGeometry = aisle.toGeoJSON().geometry;
		const properties: any = {
			object: 'aisle',
			name: aisle.name,
			id: aisle.id,
			directed: aisle.directed,
			labels: aisle.labels,
		};
		return new GeoJSONFeature('Feature', geometry, properties);
	}

	static createFeatureCollectionFromAreas(
		areas: Map<string, L.FeatureGroup<any>>,
	): GeoJSONFeatureCollection {
		const features: GeoJSONFeature[] = [];
		areas.forEach((group: L.FeatureGroup<any>, key: string) => {
			group.eachLayer((area: Area) => {
				features.push(MapStackFactory.createFeatureFromArea(area));
			});
		});
		features.sort((f1: GeoJSONFeature, f2: GeoJSONFeature) => {
			return f1.properties.id.localeCompare(f2.properties.id);
		});
		return new GeoJSONFeatureCollection('FeatureCollection', features);
	}

	static createFeatureCollectionFromWorkflowPoints(
		workflowPoints: L.FeatureGroup<WorkflowPoint>,
	): GeoJSONFeatureCollection {
		const features: GeoJSONFeature[] = [];
		workflowPoints.eachLayer((workflowPoint: WorkflowPoint) => {
			features.push(MapStackFactory.createFeatureFromWorkflowPoint(workflowPoint));
		});
		features.sort((f1: GeoJSONFeature, f2: GeoJSONFeature) => {
			return f1.properties.id.localeCompare(f2.properties.id);
		});
		return new GeoJSONFeatureCollection('FeatureCollection', features);
	}

	static createFeatureCollectionFromAisles(
		aisles: L.FeatureGroup<Aisle>,
	): GeoJSONFeatureCollection {
		const features: GeoJSONFeature[] = [];
		aisles.eachLayer((aisle: Aisle) => {
			features.push(MapStackFactory.createFeatureFromAisle(aisle));
		});
		features.sort((f1: GeoJSONFeature, f2: GeoJSONFeature) => {
			return f1.properties.id.localeCompare(f2.properties.id);
		});
		return new GeoJSONFeatureCollection('FeatureCollection', features);
	}
}
