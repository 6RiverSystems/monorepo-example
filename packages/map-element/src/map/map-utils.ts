import { MapPoint, DOMPoint } from '@sixriver/map-controller';
import { MapStack, MapStackData, parse } from '@sixriver/map-io';
import { useMemo } from 'react';

import {
	Bounds,
	ViewTransform,
	transformFromZoomBounds,
	transformFromTranslateAndScale,
	ViewState,
	calculateBounds,
	invalidBounds,
} from './view';

/**
 * Parses a map stack in json format converts it to the MapStackData format and memoizes it.
 */
export function useMapStack(
	mapStack: MapStack | MapStackData,
): { mapData: MapStackData; bounds: Bounds } {
	const name = mapStack ? mapStack.name : '';
	const buildNumber = mapStack ? mapStack.buildNumber : 0;
	const mapData = useMemo<MapStackData>(() => {
		try {
			if (!mapStack.hasOwnProperty('type') || mapStack['type'] !== 'map-stack-data') {
				return parse(mapStack as MapStack);
			}
		} catch {
			console.log('failed to parse map stack data');
			return null;
		}
		return mapStack as MapStackData;
	}, [name, buildNumber]);

	/** Boundary of the entire map-stack; A union of all areas bounds */
	const bounds = useMemo(() => (mapData ? calculateBounds(mapData) : invalidBounds), [
		name,
		buildNumber,
	]);
	return { mapData, bounds };
}

export function getViewScale(svg: SVGSVGElement, scale: number) {
	// pretty cools stuff right here, getting the screen transformation matrix and applying it on the the scale, to
	// get the scale ratio between the child and the document
	const viewScale = () => {
		let viewScale = 1;
		if (svg) {
			viewScale = (svg.getScreenCTM().a / 10) * scale;
		}
		return viewScale;
	};
	return viewScale;
}

export function getTransformFromZoom(zoom: Bounds | ViewTransform, bounds: Bounds): ViewTransform {
	let transform: ViewTransform;
	if (
		zoom.hasOwnProperty('x1') &&
		zoom.hasOwnProperty('x2') &&
		zoom.hasOwnProperty('y1') &&
		zoom.hasOwnProperty('y2')
	) {
		transform = transformFromZoomBounds(bounds, zoom as Bounds);
	} else {
		transform = transformFromTranslateAndScale(
			(zoom as ViewTransform).translate || { x: 0, y: 0 },
			(zoom as ViewTransform).scale || 1,
		);
	}
	return transform;
}

/** Map a point from the document location, apply the view transform and return the MapPoint */
export function translate(
	point: DOMPoint,
	container: HTMLElement,
	svg: SVGSVGElement,
	viewState: Omit<ViewState, 'bounds'>,
): MapPoint {
	const view = svg.viewBox.baseVal;
	const bounding = (container as HTMLSpanElement).getBoundingClientRect();
	const translate = viewState.translate;
	const screenScale = svg.getScreenCTM().a;
	const scale = viewState.scale * screenScale;

	const topOffset = bounding.top + bounding.height / 2;
	const leftOffset = bounding.left + bounding.width / 2;

	const pos: MapPoint = {
		x: view.x + view.width / 2 - translate.x + (point.x - leftOffset) / scale,
		y: view.y - view.height / 2 - translate.y - (point.y - topOffset) / scale + view.height,
		space: 'map',
	};
	return pos;
}
