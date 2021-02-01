import { Bounds } from './bounds';
import { Point } from './point';

/** Provides an interface for changing the map's view. */
export abstract class ZoomService {
	/** Bounds of the whole map which is the union of all the features. */
	abstract get bounds(): Bounds;

	/** Scale factor for the map. */
	abstract get scale(): number;

	/** Translation of the map, x and y offset from the center of the map. */
	abstract get translate(): Point;

	/** Set a new translation offset from the center of the map. */
	abstract setTranslate(translate: Point);

	/** Set a new scale ratio for the map. */
	abstract setScale(scale: number);

	/** Set a new scale and translation. */
	abstract scaleAndTranslate(scale: number, translate: Point);

	/** Scale the map around a point in the map. */
	abstract scaleAroundPoint(scale: number, point: Point);

	/** Grow the scale by a discrete step. */
	abstract zoomInDiscrete(): void;

	/** Shrink the scale in a discrete step. */
	abstract zoomOutDiscrete(): void;

	/** Reset the map zoom so that it fills the view. */
	abstract resetZoom(): void;
}
