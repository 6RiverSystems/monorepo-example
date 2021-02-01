import { assert } from '../utils/assert';
import { Bounds } from '../interfaces/bounds';
import { DOMPoint, MapPoint } from '../interfaces/point';
import { EventHandler, EventTypes } from '../interfaces/event-handler';
import { ControllerStack, LayerOptions } from './controller-stack';
import { Action } from '../interfaces/action';

/**
 * Controllers are event handlers that combine a series of user interactions and produce an Action.
 * A controller should be seen as a state machine that collects many user events and produces an Action or state change.
 * Controllers can work together simultaneously, but a Controller can also grab the focus by becoming active.
 * When a Controller becomes Active, all events are "highjacked" by that controller until it deactivates.
 * Controller authors can implement any EventHandler methods. Each EventHandler method returns bool which indicates if
 * the event should propagate to the next controller in the stack. Controllers can track the mouse, when the user clicks
 * and drags and implement mouse tracking methods. The methods are onMouseTrackStart, onMouseTracking, onMouseTrackEnd.
 */
export abstract class Controller extends EventHandler {
	private state: ControllerState;
	private states: Map<string, ControllerState> = new Map();
	private initialState: string;
	private controllerStack: ControllerStack;

	protected constructor() {
		super();
	}

	abstract name(): void;

	activate() {
		this.controllerStack.activate(this);
	}

	deactivate() {
		this.controllerStack.deactivate(this);
		this.reset();
	}

	getLayer(event: Event | string, options: LayerOptions[] = []): any {
		return this.controllerStack.getLayer(event, options);
	}

	getIntersectingLayers(bounds: Bounds): any[] {
		return this.controllerStack.getIntersectingLayers(bounds);
	}

	dispatch(action: Action): void {
		return this.controllerStack.dispatch(action);
	}

	translate(point: DOMPoint): MapPoint {
		return this.controllerStack.translate(point);
	}

	addWidget(id: string, widget: HTMLElement) {
		this.controllerStack.addWidget(id, widget);
	}

	removeWidget(id: string) {
		this.controllerStack.removeWidget(id);
	}

	addState(id: string, state: ControllerState) {
		this.states.set(id, state);
		state.controller = this;
	}

	setState(id: string) {
		assert(this.states.has(id), `State: ${id} has not been added to the controller`);
		if (this.state) {
			this.state.onUninstall(this);
		}
		this.state = this.states.get(id);
		this.state.onInstall(this);
	}

	setInitialState(id: string) {
		assert(this.states.has(id), `InitialState: ${id} has not been added to the controller`);
		this.initialState = id;
	}

	reset(): void {
		if (this.initialState) {
			this.setState(this.initialState);
		}
	}

	setControllerStack(controllerStack: ControllerStack) {
		this.controllerStack = controllerStack;
	}

	handleEvent(type: EventTypes, event: Event): boolean {
		const originalState = this.state;
		if (this.state) {
			let consumed = this.state.handleEvent(type, event);
			if (this.state !== originalState) {
				// give the new state a chance at the event
				consumed = this.state.handleEvent(type, event);
			}
			return consumed;
		}
		return this[`handle${type}`](event);
	}
}

/**
 * ControllerState maintains a 'sub-state' for Controller that has complex interaction modes.
 * A SelectionController has two modes, clicking and selecting, and box selection. You create a ControllerState for each
 * mode and each ControllerState can handle it's logic. At any given time, only one ControllerState is handling all the
 * events. The current ControllerState can be swapped by calling `Controller.setState`.
 */
export abstract class ControllerState extends EventHandler {
	public controller: Controller;

	onInstall(controller: Controller): void {}
	onUninstall(controller: Controller): void {}
}

export abstract class MouseTrackingControllerState extends ControllerState {
	public initialPos: DOMPoint;
	public initialEvent: MouseEvent;
	public delta: MapPoint;
	public isTracking = false;

	handleMouseDown(event: MouseEvent): boolean {
		this.initialEvent = event;
		this.initialPos = new DOMPoint(event.clientX, event.clientY);
		this.delta = new MapPoint(0, 0);
		this.isTracking = false;
		return false;
	}

	handleMouseMove(event: MouseEvent): boolean {
		if (!event.which) {
			return false;
		}
		if (
			!this.isTracking &&
			movedPassInteractionThreshold(this.initialPos, new DOMPoint(event.clientX, event.clientY))
		) {
			this.isTracking = true;
			this.controller.activate();

			this.handleTrackingStart(this.delta, this.initialEvent);
		}
		if (this.isTracking) {
			this.updateDelta(this.initialPos, new DOMPoint(event.clientX, event.clientY));
			this.handleTracking(this.delta, event);
		}
		return this.isTracking;
	}

	handleMouseUp(event: MouseEvent): boolean {
		if (this.isTracking) {
			this.updateDelta(this.initialPos, new DOMPoint(event.clientX, event.clientY));
			this.handleTrackingEnd(this.delta, event);
			this.controller.deactivate();
		}
		this.controller.reset();
		return this.isTracking;
	}

	updateDelta(pos1: DOMPoint, pos2: DOMPoint): MapPoint {
		const mapPos1 = this.controller.translate(pos1);
		const mapPos2 = this.controller.translate(pos2);
		this.delta = new MapPoint(mapPos2.x - mapPos1.x, mapPos2.y - mapPos1.y);

		return this.delta;
	}

	abstract handleTrackingStart(delta: MapPoint, event: Event): void;
	abstract handleTracking(delta: MapPoint, event: Event): void;
	abstract handleTrackingEnd(delta: MapPoint, event: Event): void;
}

export function movedPassInteractionThreshold(
	pos1: DOMPoint,
	pos2: DOMPoint,
	hysteresis: number = 5,
): boolean {
	return Math.abs(pos1.x - pos2.x) > hysteresis || Math.abs(pos1.y - pos2.y) > hysteresis;
}
