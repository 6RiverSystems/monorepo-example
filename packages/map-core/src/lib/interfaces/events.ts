import { LatLngBounds } from 'leaflet';

import { Pose } from './pose';


export type MapEventType = 'mfp-drag-start' | 'mfp-drag-end' |
	'sim-obj-create' | 'sim-obj-delete';

export interface MapEvent {
	type: MapEventType;
}

export interface MfpDragStartEvent extends MapEvent {
	type: 'mfp-drag-start';
	mfpId: string;
}

export interface MfpDragEndEvent extends MapEvent {
	type: 'mfp-drag-end';
	mfpId: string;
	pose: Pose;
}

export interface SimulatedObjectCreateEvent extends MapEvent {
	type: 'sim-obj-create';
	id: string;
	pose: LatLngBounds;
}
export interface SimulatedObjectDeleteEvent extends MapEvent {
	type: 'sim-obj-delete';
	id: string;
}

export type MapEvents = MfpDragEndEvent | MfpDragStartEvent | SimulatedObjectCreateEvent | SimulatedObjectDeleteEvent;
