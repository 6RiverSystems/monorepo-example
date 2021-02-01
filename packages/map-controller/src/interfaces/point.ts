/** Distinction between points that originate from events in the DOM, and LatLng points that originated from the map. */
export type ViewSpace =
	/** Represented as pixels units in a document */
	| 'dom'
	/** Map unit, with the scale and translation baked in meters */
	| 'map';

export interface Point {
	readonly space?: ViewSpace;
	x: number;
	y: number;
}

export class MapPoint implements Point {
	space: 'map';
	constructor(public x: number, public y: number) {}
}

export class DOMPoint implements Point {
	space: 'dom';
	constructor(public x: number, public y: number) {}
}
