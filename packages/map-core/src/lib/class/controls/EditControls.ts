import { Map } from 'leaflet';

import { Pose } from '../../interfaces/pose';
import { Aisle } from '../mapstack/Aisle';
import { WorkflowPoint } from '../mapstack/WorkflowPoint';
import { ImpassableArea } from '../mapstack/ImpassableArea';
import { SimulatedObject } from '../mapstack/SimulatedObject';
import { KeepOutArea } from '../mapstack/KeepOutArea';
import { CostArea } from '../mapstack/CostArea';
import { QueueArea } from '../mapstack/QueueArea';
import { SpeedLimitArea } from '../mapstack/SpeedLimitArea';
import { StayOnPathArea } from '../mapstack/StayOnPathArea';
import { WeightedArea } from '../mapstack/WeightedArea';

export interface ControlData {
	kind: string;
	html: string;
	create: (map: Map) => L.Layer;
}

export function editControls(paletteType, passedOptions): ControlData[] {
	if (paletteType === 'powerUser') {
		return [
			{
				kind: 'Simulated object',
				html: `<i class="material-icons">block</i>`,
				create: rectangleFactory(SimulatedObject, passedOptions),
			}];
	} else if (paletteType === 'editor') {
		return [
			{
				kind: 'aisle',
				html: '<i class="material-icons">arrow_right_alt</i>',
				create: polylineFactory(Aisle, 'aislePane'),
			},
			{
				kind: 'workflow point',
				html: '<i class="material-icons">play_circle_outline</i>',
				create: markerFactory(WorkflowPoint, 'shadowPane'),
			},
			{
				kind: 'Impassable area',
				html: `<i class="material-icons">block</i>`,
				create: rectangleFactory(ImpassableArea),
			},
			{
				kind: 'KeepOut area',
				html: '<i class="material-icons">warning</i>',
				create: rectangleFactory(KeepOutArea),
			},
			{
				kind: 'Cost area',
				html: '<i class="material-icons">line_weight</i>',
				create: rectangleFactory(CostArea),
			},
			{
				kind: 'Queue area',
				html: '<i class="material-icons">playlist_add</i>',
				create: rectangleFactory(QueueArea),
			},
			{
				kind: 'SpeedLimit area',
				html: '<i class="material-icons">av_timer</i>',
				create: rectangleFactory(SpeedLimitArea),
			},
			{
				kind: 'StayOnPath area',
				html: '<i class="material-icons">fullscreen</i>',
				create: rectangleFactory(StayOnPathArea),
			},
			{
				kind: 'Weighted area',
				html: '<i class="material-icons">label_important</i>',
				create: rectangleFactory(WeightedArea),
			},
		];
	}
};

function rectangleFactory(rectangleClass: any, passedOptions?) {
	if (passedOptions === undefined) {
		passedOptions = {};
	}
	return (map: Map): any => {
		const options: any = {
			...passedOptions,
			rectangleClass,
			map
		};
		return (map as any).editTools.startRectangle(null, options);
	};
}

function polylineFactory(polylineClass: any, pane: string) {
	return (map: Map): any => {
		const options: any = {
			polylineClass,
			pane,
		};
		return (map as any).editTools.startPolyline(null, options);
	};
}

function markerFactory(markerClass: any, pane: string) {
	return (map: Map): any => {
		const options: any = {
			markerClass,
			rotationAngle: 45,
			pane,
		};
		// Initial position is irrelevant as it will be changed by the user as soon as
		// she moves the mouse.
		return (map as any).editTools.startMarker(new Pose(0, 0, 0), options);
	};
}
