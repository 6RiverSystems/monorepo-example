import { Feature } from '@sixriver/map-inspector';
import { LatLng, LatLngBounds } from 'leaflet';
import { Bounds, WorkflowPointState } from '@sixriver/map-io';

import { MapCoreError } from '../../interfaces/map-core-error';
import { Layer } from '../../interfaces/layer';
import { CostArea } from './CostArea';
import { ImpassableArea } from './ImpassableArea';
import { QueueArea } from './QueueArea';
import { StayOnPathArea } from './StayOnPathArea';
import { SpeedLimitArea } from './SpeedLimitArea';
import { WeightedArea } from './WeightedArea';
import { WorkflowPoint } from './WorkflowPoint';
import { Aisle } from './Aisle';
import { KeepOutArea } from './KeepOutArea';

function convertBounds(bounds: LatLngBounds): Bounds {
	return [
		[bounds.getSouthWest().lat, bounds.getSouthWest().lng],
		[bounds.getNorthEast().lat, bounds.getNorthEast().lng],
	];
}

export function layerToFeature(layer: Layer): Feature {
	let feature: Feature;
	// Create new layers based on the original layer
	if (layer instanceof Aisle) {
		feature = {
			points: (layer.getLatLngs() as LatLng[]).map(latlng => [latlng.lat, latlng.lng]),
			properties: {
				type: 'aisle',
				name: layer.name,
				id: layer.id,
				labels: layer.labels,
				object: 'aisle',
				directed: layer.directed,
			},
		};
	} else if (layer instanceof CostArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'costArea',
				id: layer.id,
				name: layer.name,
				cost: layer.cost,
			},
		};
	} else if (layer instanceof ImpassableArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'impassable',
				id: layer.id,
				name: layer.name,
			},
		};
	} else if (layer instanceof KeepOutArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'keepOut',
				id: layer.id,
				name: layer.name,
			},
		};
	} else if (layer instanceof QueueArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'queue',
				id: layer.id,
				name: layer.name,
				queueName: layer.queueName,
			},
		};
	} else if (layer instanceof StayOnPathArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'stayOnPath',
				id: layer.id,
				name: layer.name,
			},
		};
	} else if (layer instanceof SpeedLimitArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'speedLimit',
				id: layer.id,
				name: layer.name,
				maxVelocity: layer.maxVelocity,
			},
		};
	} else if (layer instanceof WeightedArea) {
		feature = {
			bounds: convertBounds(layer.getBounds()),
			properties: {
				type: 'weightedArea',
				id: layer.id,
				name: layer.name,
				n: layer.weights.north,
				ne: layer.weights.northEast,
				e: layer.weights.east,
				se: layer.weights.southEast,
				s: layer.weights.south,
				sw: layer.weights.southWest,
				w: layer.weights.west,
				nw: layer.weights.northWest,
			},
		};
	} else if (layer instanceof WorkflowPoint) {
		feature = {
			position: [layer.pose.x, layer.pose.y],
			properties: {
				type: 'workflowPoint',
				object: 'vertex',
				orientation: layer.pose.orientation,
				id: layer.id,
				name: layer.name,
				labels: layer.labels,
				workflowOptions: layer.workflowOptions,
				target: layer.target as WorkflowPointState['properties']['target'],
			},
		};
	} else {
		throw new MapCoreError(`Can't convert layer: ${layer.id}`);
	}
	return feature;
}
