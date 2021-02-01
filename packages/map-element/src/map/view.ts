import { MapStackData } from '@sixriver/map-io';
import { createContext } from 'react';

export type Point = { x: number; y: number };
export type Bounds = { x1: number; x2: number; y1: number; y2: number };

export const invalidBounds = {
	x1: Number.MAX_SAFE_INTEGER,
	y1: Number.MAX_SAFE_INTEGER,
	x2: Number.MIN_SAFE_INTEGER,
	y2: Number.MIN_SAFE_INTEGER,
} as const;

export interface ViewTransform {
	scale: number;
	translate: {
		x: number;
		y: number;
	};
	rotate?: number;
}

export interface ViewState extends ViewTransform {
	bounds: Bounds;
}

export interface ViewContextContents extends ViewTransform {
	/**
	 * Current scale of the map. Useful when the rendering code needs to know about the map's scale.
	 * This property is provided by the map, is a combination of the local scale, that was provided by the zoom, and the
	 * screen matrix that is dependent on how much the svg was scaled to fit in the document.
	 */
	viewScale?: () => number;
	bounds: Bounds;
}

export const ViewContext = createContext<ViewContextContents>({
	scale: 1,
	translate: { x: 0, y: 0 },
	bounds: invalidBounds,
});

/** Get the transform string for zooming in on an arbitrary rectangle */
export function transformFromZoomBounds(bounds: Bounds, zoom: Bounds): ViewTransform {
	const scale = Math.abs(
		Math.min(
			(bounds.x2 - bounds.x1) / (zoom.x2 - zoom.x1),
			(bounds.y2 - bounds.y1) / (zoom.y2 - zoom.y1),
		),
	);
	// transform to the center of the zoom:
	const translate = {
		x: (bounds.x2 + bounds.x1) / 2 - (zoom.x1 + zoom.x2) / 2,
		y: (bounds.y2 + bounds.y1) / 2 - (zoom.y1 + zoom.y2) / 2,
	};
	return { scale, translate };
}

/**
 * Get the transform for scaling around a point
 * Zooms the map while keeping a specified geographical point on the map
 * stationary (e.g. used internally for scroll zoom and double-click zoom).
 **/
export function transformAroundPointWithScale(
	zoomPoint: Point,
	newScale: number = 1,
	{ scale, translate, bounds }: ViewState,
): ViewTransform {
	const width = bounds.x2 - bounds.x1;
	const height = bounds.y2 - bounds.y1;

	// unbake the translate out of the Point
	const viewPoint = { ...zoomPoint };
	viewPoint.x = zoomPoint.x - bounds.x1 - width / 2 + translate.x;
	viewPoint.y = zoomPoint.y - bounds.y1 + height / 2 + translate.y - height;

	const newTranslate = {
		// calculate x and y based on zoom
		x: translate.x - viewPoint.x + viewPoint.x * (scale / newScale),
		y: translate.y - viewPoint.y + viewPoint.y * (scale / newScale),
	};

	return { scale: newScale, translate: newTranslate };
}

/** Get the transform for translating and scaling */
export function transformFromTranslateAndScale(
	translate: { x: number; y: number },
	scale: number,
): ViewTransform {
	return { scale, translate };
}

/** Create a bounds rectangle that represents a union of all the logical areas */
export function calculateBounds(map: MapStackData): Bounds {
	const mapBounds = map.areas.reduce(
		(bounds, area) => {
			const [[y1, x1], [y2, x2]] = area.bounds;
			bounds.y1 = Math.min(bounds.y1, y1);
			bounds.x1 = Math.min(bounds.x1, x1);
			bounds.y2 = Math.max(bounds.y2, y2);
			bounds.x2 = Math.max(bounds.x2, x2);
			return bounds;
		},
		{ ...invalidBounds },
	);
	return mapBounds;
}

/**
 * Takes a view scale and applies a function for non-linear zoom scaling.
 * This is used for rendering map features at a size that is different from the current zoom.
 */
export type ScalingFunction = (scale: number) => number;

/**
 * Does not apply a scaling function.
 * Map feature will increase or decrease in size based on the map scale
 */
export const noopScale: ScalingFunction = function(_: number): number {
	return 1;
};

/**
 * Negates the effect of a scale.
 * Makes a map feature always appear the same size regardless of the zoom amount.
 */
export const unscale: ScalingFunction = function(scale: number): number {
	return 1 / scale;
};

/**
 * Negates the effect of a scale when zooming out and viewing a tiny map.
 * The map feature will not shrink beyond 1:1 when zooming out.
 */
export const scaleMin: ScalingFunction = function(scale: number): number {
	return scale < 1 ? unscale(scale) : 1;
};

/**
 * Negates the effect of a scale when zooming in and viewing a small portion of the map blown up on the screen.
 * The map feature will not grow beyond 1:1 when zooming in.
 */
export const scaleMax: ScalingFunction = function(scale: number): number {
	return scale > 1 ? unscale(scale) : 1;
};
