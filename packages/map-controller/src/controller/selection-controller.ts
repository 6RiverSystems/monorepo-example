import { Controller, ControllerState, MouseTrackingControllerState } from './controller';
import { SelectionService } from '../interfaces/selection-service';
import { DOMPoint, MapPoint } from '../interfaces/point';
import { Bounds } from '../interfaces/bounds';

enum SelectionControllerStates {
	Idle = 'Idle',
	BoxSelect = 'BoxSelect',
}

interface SelectionOptions {
	boxSelectOnEmptySpace?: boolean;
	boxSelectOnShift?: boolean;
}

export class SelectionController extends Controller {
	public options: SelectionOptions = {
		boxSelectOnEmptySpace: false,
		boxSelectOnShift: true,
	};

	constructor(public selectionService: SelectionService) {
		super();

		this.addState(SelectionControllerStates.Idle, new IdleState());
		this.addState(SelectionControllerStates.BoxSelect, new BoxSelectState());

		this.setInitialState(SelectionControllerStates.Idle);
	}

	name() {
		return 'SelectionController';
	}
}

class IdleState extends ControllerState {
	public controller: SelectionController;
	public initialPos: DOMPoint;
	private selectedId: string;

	handleMouseDown(event: MouseEvent): boolean {
		const selectionService = this.controller.selectionService;
		const options = this.controller.options;
		this.initialPos = new DOMPoint(event.clientX, event.clientY);
		const shiftDown = event.shiftKey;
		const target = this.controller.getLayer(event, ['selectable']);

		this.selectedId = undefined;

		if (target) {
			// single click selection
			if (!selectionService.selected.has(target.id)) {
				selectionService.select(target.id, shiftDown);
				this.selectedId = target.id;
			}
		} else if (!shiftDown) {
			// click empty area should deselect all
			selectionService.clear();
		}

		// start a box selection state
		if ((options.boxSelectOnShift && shiftDown) || (options.boxSelectOnEmptySpace && !target)) {
			this.controller.setState(SelectionControllerStates.BoxSelect);
			return true;
		}
		return false;
	}

	handleMouseUp(event: MouseEvent): boolean {
		const selectionService = this.controller.selectionService;
		const shiftDown = event.shiftKey;
		const target = this.controller.getLayer(event, ['selectable']);
		// de-selection has to happen on mouseup as we want to give other controllers the chance at the mouse events.
		// This is apparent when attempting to drag while holding down the shift key.
		if (target && target.id !== this.selectedId) {
			// single click de-selection
			if (selectionService.selected.has(target.id) && shiftDown) {
				selectionService.deselect(target.id);
			}
		}
		return false;
	}
}

class BoxSelectState extends MouseTrackingControllerState {
	public controller: SelectionController;
	private box: HTMLElement;

	handleTrackingStart(delta: MapPoint, event: MouseEvent) {
		this.box = document.createElement('div');
		this.box.classList.add('leaflet-zoom-box');
		this.controller.addWidget('select-box', this.box);
	}

	handleTracking(delta: MapPoint, event: MouseEvent) {
		const point = this.controller.translate(new DOMPoint(event.clientX, event.clientY));

		const bounds = new Bounds(this.controller.translate(this.initialPos), point);
		this.box.style.left = bounds.min.x + 'px';
		this.box.style.top = bounds.min.y + 'px';
		this.box.style.width = bounds.getSize().x + 'px';
		this.box.style.height = bounds.getSize().y + 'px';

		const selected = this.controller.getIntersectingLayers(bounds);
		this.controller.selectionService.select(
			selected.map(s => s.id),
			false,
		);
	}

	handleTrackingEnd(delta: MapPoint, event: Event) {
		this.controller.removeWidget('select-box');
	}
}
