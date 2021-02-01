import { Feature } from '@sixriver/map-inspector';
import { LatLng, LatLngBounds } from 'leaflet';
import {
	Bounds,
	AisleState,
	SpeedLimitAreaState,
	CostAreaState,
	AreaState,
	QueueAreaState,
	WeightedAreaState,
	WorkflowPointState,
} from '@sixriver/map-io';

import { Layer } from '../../interfaces/layer';
import { CostArea } from './CostArea';
import { ImpassableArea } from './ImpassableArea';
import { QueueArea } from './QueueArea';
import { StayOnPathArea } from './StayOnPathArea';
import { SpeedLimitArea } from './SpeedLimitArea';
import { WeightedArea, WeightCosts } from './WeightedArea';
import { WorkflowPoint } from './WorkflowPoint';
import { Aisle } from './Aisle';
import { KeepOutArea } from './KeepOutArea';
import { Pose } from '../../interfaces/pose';

function convertBounds(bounds: Bounds): LatLngBounds {
	return new LatLngBounds(
		new LatLng(bounds[1][0], bounds[1][1]),
		new LatLng(bounds[0][0], bounds[0][1]),
	);
}

export function featureToLayer(feature: Feature): Layer {
	let layer: Layer;
	const type = feature.properties.type;
	switch (type) {
		case 'aisle':
			const aisleFeature = feature as AisleState;
			const points = aisleFeature.points;
			const start: LatLng = new LatLng(points[0][0], points[0][1]);
			const end: LatLng = new LatLng(points[1][0], points[1][1]);
			layer = new Aisle([start, end], {}, feature.properties.name, feature.properties.id);
			layer.name = feature.properties.name;
			layer.directed = aisleFeature.properties.directed;
			layer.labels = aisleFeature.properties.labels;
			break;
		case 'costArea':
			layer = new CostArea(
				convertBounds((feature as AreaState).bounds),
				{},
				feature.properties.name,
				feature.properties.id,
			);
			(layer as CostArea).cost = (feature as CostAreaState).properties.cost;
			break;
		case 'impassable':
			layer = new ImpassableArea(
				convertBounds((feature as AreaState).bounds),
				{},
				feature.properties.name,
				feature.properties.id,
			);
			break;
		case 'keepOut':
			layer = new KeepOutArea(
				convertBounds((feature as AreaState).bounds),
				{},
				feature.properties.name,
				feature.properties.id,
			);
			break;
		case 'queue':
			layer = new QueueArea(
				convertBounds((feature as AreaState).bounds),
				{},
				(feature as QueueAreaState).properties.queueName,
				feature.properties.name,
				feature.properties.id,
			);
			break;
		case 'speedLimit':
			layer = new SpeedLimitArea(
				convertBounds((feature as AreaState).bounds),
				{},
				feature.properties.name,
				feature.properties.id,
			);
			(layer as SpeedLimitArea).maxVelocity = (feature as SpeedLimitAreaState).properties.maxVelocity;
			break;

		case 'stayOnPath':
			layer = new StayOnPathArea(
				convertBounds((feature as AreaState).bounds),
				{},
				feature.properties.name,
				feature.properties.id,
			);
			break;
		case 'weightedArea':
			const weightedArea = feature as WeightedAreaState;
			const weights: WeightCosts = {
				north: weightedArea.properties.n,
				northEast: weightedArea.properties.ne,
				east: weightedArea.properties.e,
				southEast: weightedArea.properties.se,
				south: weightedArea.properties.s,
				southWest: weightedArea.properties.sw,
				west: weightedArea.properties.w,
				northWest: weightedArea.properties.nw,
			};
			layer = new WeightedArea(
				convertBounds((feature as AreaState).bounds),
				{},
				feature.properties.name,
				feature.properties.id,
				weights,
			);
			break;
		case 'workflowPoint':
			const workflowPoint = feature as WorkflowPointState;
			layer = new WorkflowPoint(
				new Pose(
					workflowPoint.position[0],
					workflowPoint.position[1],
					workflowPoint.properties.orientation,
				),
				{},
				feature.properties.id,
			);
			layer.labels = workflowPoint.properties.labels;
			layer.name = feature.properties.name;
			layer.workflowOptions = workflowPoint.properties.workflowOptions;
			layer.target = workflowPoint.properties.target;
			break;
	}
	return layer;
}
