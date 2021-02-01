import { Controller } from './controller';
import { EventTypes } from '../interfaces/event-handler';
import { Bounds } from '../interfaces/bounds';
import { DOMPoint, MapPoint } from '../interfaces/point';
import { assert } from '../utils/assert';
import { Action } from '../interfaces/action';

export type LayerOptions = 'selectable' | 'movable' | 'editable' | 'inspectable';

/**
 * Controllers are managed by the ControllerStack which determines the order of priority based on insertion.
 * Upon creation, the ControllerStack registers to all the DOM events on the map. Later, The ControllerStack will
 * dispatch the events to the controllers and prioritizes the order in which events are propagated.
 * Event propagation cycle occurs as two phases:
 *  Observation - All the controllers get a chance at inspecting the events
 *  Activation - A Controller becomes active and all the events are funneled to that controller until it deactivates
 */
export class ControllerStack {
	public getLayer: (event: Event | string, options: LayerOptions[]) => any;
	public getIntersectingLayers: (bounds: Bounds) => any[];
	public dispatch: (action: Action) => void;
	public translate: (point: DOMPoint) => MapPoint;

	private _activeController: Controller;
	private _controllers: Controller[] = [];
	private _handlers: { [key: string]: any };
	private _captureHandlers: { [key: string]: any };
	private _widgets: { [key: string]: HTMLElement } = {};
	private root: HTMLElement;

	constructor(root?: HTMLElement) {
		if (root) {
			this.install(root);
		}
	}

	install(root: HTMLElement) {
		if (root === this.root) {
			return;
		}
		this.uninstall();
		this.root = root;
		this._handlers = {
			click: (event: Event) => this.handleEvent(EventTypes.Click, event),
			dblclick: (event: Event) => this.handleEvent(EventTypes.DblClick, event),
			mousedown: (event: Event) => this.mouseDownAndCapture(event),
			mousemove: (event: Event) => this.handleEvent(EventTypes.MouseMove, event),
			mouseover: (event: Event) => this.handleEvent(EventTypes.MouseOver, event),
			mouseout: (event: Event) => this.handleEvent(EventTypes.MouseOut, event),
			wheel: (event: Event) => this.handleEvent(EventTypes.Wheel, event),
			contextmenu: (event: Event) => this.handleEvent(EventTypes.ContextMenu, event),
			keypress: (event: Event) => this.handleEvent(EventTypes.KeyPress, event),
		};
		Object.keys(this._handlers).forEach(key =>
			this.root.addEventListener(key, this._handlers[key], false),
		);
		this._captureHandlers = {
			mousemove: (e: MouseEvent) => this.handleEvent(EventTypes.MouseMove, e),
			mouseup: (e: MouseEvent) => {
				this.handleEvent(EventTypes.MouseUp, e);
				this.clearCaptureHandlers();
			},
		};
	}

	uninstall() {
		if (this.root && this._handlers) {
			Object.keys(this._handlers).forEach(key =>
				this.root.removeEventListener(key, this._handlers[key]),
			);
		}
		if (this._widgets) {
			Object.keys(this._widgets).forEach(id => this.removeWidget(id));
		}
	}

	addController(controller: Controller) {
		assert(
			this._controllers.indexOf(controller) === -1,
			`Controller: ${controller.name()} has already been added to the stack`,
		);
		this._controllers.push(controller);
		controller.setControllerStack(this);
		controller.reset();
	}

	removeController(controller: Controller) {
		assert(
			this._controllers.indexOf(controller) !== -1,
			`Controller: ${controller.name()} is not in the stack`,
		);
		controller.setControllerStack(undefined);

		const index = this._controllers.indexOf(controller);
		this._controllers.splice(index, 1);

		if (this._activeController === controller) {
			this.deactivate(controller);
		}
	}

	get activeController(): Controller {
		return this._activeController;
	}

	get controllers(): ReadonlyArray<Controller> {
		return this._controllers;
	}

	activate(controller: Controller) {
		if (this._activeController) {
			this._activeController.reset();
		}
		this._activeController = controller;
	}

	deactivate(controller: Controller) {
		assert(
			this._activeController === controller,
			'Attempting to deactivate a controller that is not the active Controller',
		);

		controller.reset();
		this._activeController = undefined;
	}

	addWidget(id: string, widget: HTMLElement) {
		if (this._widgets[id]) {
			this.removeWidget(id);
		}

		this._widgets[id] = widget;
		this.root.appendChild(widget);
	}

	removeWidget(id: string) {
		const widget = this._widgets[id];
		if (widget) {
			this.root.removeChild(widget);
			delete this._widgets[id];
		}
	}

	private clearCaptureHandlers() {
		['mousemove', 'mouseup'].forEach(type => {
			if (this._captureHandlers[type]) {
				document.removeEventListener(type, this._captureHandlers[type], false);
			}
		});
		this.root.addEventListener('mousemove', this._handlers['mousemove']);
	}

	private mouseDownAndCapture(event: Event): void {
		this.clearCaptureHandlers();

		this.root.removeEventListener('mousemove', this._handlers['mousemove']);

		['mousemove', 'mouseup'].forEach(type => {
			document.addEventListener(type, this._captureHandlers[type], false);
		});

		this.handleEvent(EventTypes.MouseDown, event);
	}

	public handleEvent(type: EventTypes, event: Event): boolean {
		let consume = false;
		if (this._activeController) {
			consume = this._activeController.handleEvent(type, event);
		} else {
			consume = this._controllers.some(controller => controller.handleEvent(type, event));
		}
		if (consume) {
			event.stopPropagation();
			event.preventDefault();
			event.stopImmediatePropagation();
		}
		return consume;
	}
}
