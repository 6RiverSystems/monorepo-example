import { Point } from './point';

export class Bounds {
	public min: Point = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
	public max: Point = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER };

	constructor(p1?: Point, p2?: Point) {
		if (p1 && p2) {
			this.min = { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) };
			this.max = { x: Math.max(p1.x, p2.x), y: Math.max(p1.y, p2.y) };
		}
	}
	getSize() {
		return { x: this.max.x - this.min.x, y: this.max.y - this.min.y };
	}

	/** Produces an invalid Bounds object, which can be used for initial states */
	static invalid() {
		return new Bounds();
	}
}
