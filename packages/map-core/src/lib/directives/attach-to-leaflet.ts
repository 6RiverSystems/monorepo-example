import { Util, LatLngBounds } from 'leaflet';
import * as L from 'leaflet';
import {
	ControllerStack,
	LayerOptions,
	EventTypes,
	DOMPoint,
	MapPoint,
	Bounds,
} from '@sixriver/map-controller';
import { NgZone } from '@angular/core';

import { DisplayOptionsMap } from '../interfaces/map-display-options';
import { Layer } from '../interfaces/layer';

export function attachToLeaflet(
	controllerStack: ControllerStack,
	map: L.Map,
	mapOptions: DisplayOptionsMap,
	ngZone: NgZone,
) {
	// retrieves the target leaflet layer of an event.
	controllerStack.getLayer = (
		event: Event | string,
		options: LayerOptions[] = [],
	): Layer | undefined => {
		let target: Layer | undefined;
		if (typeof event === 'string') {
			const layers = (map as any)._targets;
			const leafletId = Object.keys(layers).find(id => layers[id].id === event);
			target = layers[leafletId];
		} else {
			target = findTarget(event.target as HTMLElement, map);
			if (target instanceof L.Map) {
				target = undefined;
			}
		}
		if (target !== undefined && testOptions(target, mapOptions, options)) {
			return target;
		}
		return undefined;
	};

	// gets the collection of intersecting layers.
	controllerStack.getIntersectingLayers = (bounds: Bounds): Layer[] => {
		const latLngBounds = new LatLngBounds(
			map.containerPointToLatLng(new L.Point(bounds.min.x, bounds.min.y)),
			map.containerPointToLatLng(new L.Point(bounds.max.x, bounds.max.y)),
		);

		const intersection = [];
		const layers = (map as any)._targets;
		for (const leafletId of Object.keys(layers)) {
			const layer = layers[leafletId];
			if (
				!(layer instanceof L.Map) &&
				layer.id &&
				((layer.getBounds &&
					layer.getBounds().isValid() &&
					latLngBounds.intersects(layer.getBounds())) ||
					(layer.getLatLng && layer.getLatLng() && latLngBounds.contains(layer.getLatLng())))
			) {
				intersection.push(layer);
			}
		}
		return intersection;
	};

	controllerStack.translate = (point: DOMPoint): MapPoint => {
		const pt = map.mouseEventToContainerPoint({
			clientX: point.x,
			clientY: point.y,
		} as any);
		return new MapPoint(pt.x, pt.y);
	};

	// map changes do not concern angular.
	// Angular registers for all the events that are possible in a browser. It does this so that
	// it can detect memory changes and update components automatically. This is excessive with
	// leaflet and can reduce performance. Angular isn't really concerned with the internal state
	// of the map so we execute the events on the map outside the Angular zone.
	const original = controllerStack.handleEvent;
	controllerStack.handleEvent = (type: EventTypes, event: Event) => {
		if (ngZone) {
			return ngZone.runOutsideAngular(original.bind(controllerStack, type, event));
		}
	};
}

/**
 * Some layers are not selectable, some layers are not movable. The Controller passes the layer options
 * that it is looking for in a layer and testOptions function filters the layer based on those
 * qualification and the DisplayOptions
 */
function testOptions(
	layer: Layer,
	mapOptions: DisplayOptionsMap,
	layerOptions: LayerOptions[],
): boolean {
	return (
		layer.type &&
		mapOptions.has(layer.type as any) &&
		(layerOptions.length === 0 ||
			layerOptions.every(option => {
				return mapOptions.get(layer.type as any)[option];
			}))
	);
}

/**
 * Find the Leaflet.Layer from an event target.
 */
function findTarget(target: HTMLElement, map: L.Map): Layer {
	// Ignore the target if it is the draggable markers that are used for resizing an area
	if ((target as HTMLElement).classList.contains('leaflet-vertex-icon')) {
		return undefined;
	}

	const id = Util.stamp(target);
	const layer = (map as any)._targets[id];
	if (!layer && target.parentElement) {
		return findTarget(target.parentElement, map);
	}
	return layer as Layer;
}
