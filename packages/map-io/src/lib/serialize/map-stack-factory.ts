import { omit, map } from 'lodash-es';

import { GeoJSONGeometry, GeoJSONFeature, GeoJSONFeatureCollection } from './GeoJSON';
import {
	Bounds,
	Point,
	AreaState,
	AreaProperties,
	WorkflowPointState,
	AisleState,
	MapFeatureState,
	MapFeatureProperties,
} from '../interfaces/map-stack';

export class MapStackFactory {
	static createBoundsFromGeometry(geometry: GeoJSONGeometry): Bounds {
		const southWest: Point = geometry.coordinates[0][0];
		const northEast: Point = geometry.coordinates[0][2];
		return <Bounds>[
			[southWest[1], southWest[0]],
			[northEast[1], northEast[0]],
		];
	}

	static createGeometryFromBounds(bounds: Bounds): GeoJSONGeometry {
		const polygon = [
			[
				[bounds[0][1], bounds[0][0]],
				[bounds[0][1], bounds[1][0]],
				[bounds[1][1], bounds[1][0]],
				[bounds[1][1], bounds[0][0]],
				[bounds[0][1], bounds[0][0]],
			],
		];
		return new GeoJSONGeometry('Polygon', polygon);
	}

	static createAreaFromFeature(feature: GeoJSONFeature): AreaState<AreaProperties> {
		return <AreaState<AreaProperties>>{
			properties: feature.properties,
			bounds: MapStackFactory.createBoundsFromGeometry(feature.geometry),
		};
	}

	static createWorkflowPointFromFeature(feature: GeoJSONFeature): WorkflowPointState {
		return <WorkflowPointState>{
			properties: Object.assign({}, feature.properties, {
				type: 'workflowPoint',
			}),
			position: feature.geometry.coordinates,
		};
	}

	static createAisleFromFeature(feature: GeoJSONFeature): AisleState {
		const start: Point = [feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0]];
		const end: Point = [feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]];
		return <AisleState>{
			properties: Object.assign({}, feature.properties, {
				type: 'aisle',
			}),
			points: [start, end],
		};
	}

	static toGeoJSON(mapObject: MapFeatureState): GeoJSONGeometry {
		switch (mapObject.properties.type) {
			case 'aisle':
				const points = (mapObject as AisleState).points;
				return new GeoJSONGeometry('LineString', [points[0].reverse(), points[1].reverse()]);

			case 'workflowPoint':
				const point = (mapObject as WorkflowPointState).position;
				return new GeoJSONGeometry('Point', point);

			default:
			case 'costArea':
			case 'impassable':
			case 'keepOut':
			case 'playSoundArea': // deprecated
			case 'queue':
			case 'speedLimit':
			case 'stayOnPath':
			case 'weightedArea':
				return MapStackFactory.createGeometryFromBounds(
					(mapObject as AreaState<MapFeatureProperties>).bounds,
				);
		}
	}

	static createFeatureFromMapObject(mapObject: MapFeatureState): GeoJSONFeature {
		const geometry: GeoJSONGeometry = MapStackFactory.toGeoJSON(mapObject);
		const properties =
			mapObject.properties.type === 'workflowPoint' || mapObject.properties.type === 'aisle'
				? omit(mapObject.properties, ['type'])
				: mapObject.properties;
		return new GeoJSONFeature('Feature', geometry, properties);
	}

	static createFeatureCollectionFromMapObjects(
		mapObjects: MapFeatureState[],
	): GeoJSONFeatureCollection {
		const collection = mapObjects
			.map((obj: MapFeatureState) => MapStackFactory.createFeatureFromMapObject(obj))
			.sort((f1: GeoJSONFeature, f2: GeoJSONFeature) =>
				f1.properties.id.localeCompare(f2.properties.id),
			);
		return new GeoJSONFeatureCollection('FeatureCollection', collection);
	}
}
