import {
	Marker,
	Polyline,
	LatLngBounds,
	Rectangle,
	LatLng,
	Map,
	Layer as LeafletLayer,
	ImageOverlay,
} from 'leaflet';
import {
	Controller,
	ControllerState,
	MouseTrackingControllerState,
	Point,
	DOMPoint,
} from '@sixriver/map-controller';
import { round } from 'lodash-es';

import { SelectionService } from '../../services/selection.service';

enum MoveControllerStates {
	Idle = 'Idle',
	Moving = 'Moving',
}

/**
 * The MoveController takes the selected layers and translates them by a delta.
 * This implementation is temporary and it mutates the presentation layer.
 * In the future when the map stack is modeled in the store, the move controller will produce an action which will
 * change the location of the layers in the store.
 */
export class MoveController extends Controller {
	constructor(public selectionService: SelectionService, public map: Map) {
		super();

		this.addState(MoveControllerStates.Idle, new IdleState());
		this.addState(MoveControllerStates.Moving, new MovingState());

		this.setInitialState(MoveControllerStates.Idle);
	}

	reset() {
		super.reset();
		this.map.dragging.enable();
	}

	name() {
		return 'MoveController';
	}
}

/**
 * If the target of a mousedown is a selected layer, move to the MovingState
 */
class IdleState extends ControllerState {
	public controller: MoveController;
	public initialPos: Point;

	handleMouseDown(event: MouseEvent): boolean {
		const selectionService = this.controller.selectionService;
		this.initialPos = new DOMPoint(event.clientX, event.clientY);
		const target = this.controller.getLayer(event, ['movable']);

		if (target && selectionService.selected.has(target.id)) {
			this.controller.setState(MoveControllerStates.Moving);
			this.controller.map.dragging.disable();
			return true;
		}
		return false;
	}
}

/**
 * Capture all the selected layers initial geometry. During tracking, apply the delta on the initial geometry to get the
 * new translated location without accumulating error. We have to deal with 3 types of layers: Marker, Rectangle and
 * Polyline.
 */
class MovingState extends MouseTrackingControllerState {
	public controller: MoveController;
	private movingLayers: {};

	onInstall() {
		this.movingLayers = {};
	}

	handleTrackingStart(delta: Point, event: MouseEvent) {
		// capture the original geometry
		this.controller.selectionService.selected.forEach(id => {
			const layer: LeafletLayer = this.controller.getLayer(id, ['movable']);
			if (layer) {
				if (layer instanceof Marker) {
					this.movingLayers[id] = { layer, geometry: layer.getLatLng() };
				} else if (layer instanceof Rectangle || layer instanceof ImageOverlay) {
					this.movingLayers[id] = { layer, geometry: layer.getBounds() };
				} else if (layer instanceof Polyline) {
					this.movingLayers[id] = { layer, geometry: layer.getLatLngs() };
				}
				layer.fire('dragstart');
			}
		});
	}

	handleTracking(delta: Point, event: MouseEvent) {
		// TODO: the correct way to move objects is to issue a move action
		// with a delta payload. But since we don't have the map stack
		// modeled in the store it's not feasible yet.
		const map = this.controller.map;
		const latLngAfter = map.mouseEventToLatLng(event);
		const latLngOrigin = map.mouseEventToLatLng(this.initialEvent);
		const latLngDelta = new LatLng(
			latLngAfter.lat - latLngOrigin.lat,
			latLngAfter.lng - latLngOrigin.lng,
		);
		this.controller.selectionService.selected.forEach(id => {
			const movingLayer = this.movingLayers[id];
			const layer = movingLayer.layer as any;
			if (layer instanceof Marker) {
				layer.setLatLng(this.applyDelta(movingLayer.geometry, latLngDelta));
			} else if (layer instanceof Rectangle || layer instanceof ImageOverlay) {
				(layer as Rectangle).setBounds(
					new LatLngBounds(
						this.applyDelta(movingLayer.geometry.getSouthWest(), latLngDelta),
						this.applyDelta(movingLayer.geometry.getNorthEast(), latLngDelta),
					),
				);
			} else if (layer instanceof Polyline) {
				const transformed = movingLayer.geometry.map((latLng: LatLng) =>
					this.applyDelta(latLng, latLngDelta),
				);
				(layer as Polyline).setLatLngs(transformed);
			}
			layer.fire('drag', event);

			// remove the markers from the resize controller as defined in Leaflet.Editable
			layer.disableEdit();
		});
	}

	handleTrackingEnd(delta: Point, event: Event) {
		this.controller.selectionService.selected.forEach(id => {
			const movingLayer = this.movingLayers[id];
			const layer = movingLayer.layer as any;
			layer.fire('dragend', event);
		});
	}

	private applyDelta(latLng: LatLng, delta: LatLng): LatLng {
		return new LatLng(round(latLng.lat + delta.lat, 3), round(latLng.lng + delta.lng, 3));
	}
}
