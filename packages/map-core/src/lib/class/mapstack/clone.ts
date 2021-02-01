import { pick } from 'lodash-es';

import { MapCoreError } from '../../interfaces/map-core-error';
import { Layer } from '../../interfaces/layer';
import { MfpDisplay } from './MfpDisplay';
import { CostArea } from './CostArea';
import { ImpassableArea } from './ImpassableArea';
import { SimulatedObject } from './SimulatedObject';
import { QueueArea } from './QueueArea';
import { StayOnPathArea } from './StayOnPathArea';
import { SpeedLimitArea } from './SpeedLimitArea';
import { WeightedArea } from './WeightedArea';
import { WorkflowPoint } from './WorkflowPoint';
import { Aisle } from './Aisle';
import { KeepOutArea } from './KeepOutArea';

export function clone(layer: Layer) {
	let layerCopy: Layer;
	// Create new layers based on the original layer
	if (layer instanceof Aisle) {
		layerCopy = new Aisle(layer.getLatLngs() as any, layer.options, layer.name, layer.id);
	} else if (layer instanceof CostArea) {
		layerCopy = new CostArea(layer.getBounds(), layer.options, layer.name, layer.id);
	} else if (layer instanceof ImpassableArea) {
		layerCopy = new ImpassableArea(layer.getBounds(), layer.options, layer.name, layer.id);
	} else if (layer instanceof SimulatedObject) {
		layerCopy = new SimulatedObject(layer.getBounds(), layer.options, layer.name, layer.id);
	} else if (layer instanceof KeepOutArea) {
		layerCopy = new KeepOutArea(layer.getBounds(), layer.options, layer.name, layer.id);
	} else if (layer instanceof MfpDisplay) {
		layerCopy = new MfpDisplay(layer.mfpState, -1, layer.options);
	} else if (layer instanceof QueueArea) {
		layerCopy = new QueueArea(
			layer.getBounds(),
			layer.options,
			layer.queueName,
			layer.name,
			layer.id,
		);
	} else if (layer instanceof StayOnPathArea) {
		layerCopy = new StayOnPathArea(layer.getBounds(), layer.options, layer.name, layer.id);
	} else if (layer instanceof SpeedLimitArea) {
		layerCopy = new SpeedLimitArea(layer.getBounds(), layer.options, layer.name, layer.id);
	} else if (layer instanceof WeightedArea) {
		layerCopy = new WeightedArea(
			layer.getBounds(),
			layer.options,
			layer.name,
			layer.id,
			layer.weights,
		);
	} else if (layer instanceof WorkflowPoint) {
		layerCopy = new WorkflowPoint(layer.pose, layer.options, layer.id);
	} else {
		throw new MapCoreError(`Can't clone layer: ${layer.id}`);
	}
	// pick the special properties that may or may not exist on the original layer.
	Object.assign(
		layerCopy,
		pick(layer, [
			'pose',
			'labels',
			'directed',
			'cost',
			'maxVelocity',
			'weights',
			'name',
			'labels',
			'workflowOptions',
		]),
	);
	return layerCopy;
}
