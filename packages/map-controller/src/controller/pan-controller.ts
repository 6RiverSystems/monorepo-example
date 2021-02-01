import { Point, MapPoint } from '../interfaces/point';
import { Controller, ControllerState, MouseTrackingControllerState } from './controller';
import { ZoomService } from '../interfaces/zoom-service';

enum PanControllerStates {
	Idle = 'Idle',
	Panning = 'Panning',
}

export class PanController extends Controller {
	public position: HTMLElement;
	constructor(public zoomService: ZoomService) {
		super();

		this.addState(PanControllerStates.Idle, new IdleState());
		this.addState(PanControllerStates.Panning, new PanningState());

		this.setInitialState(PanControllerStates.Idle);
	}

	name() {
		return 'PanController';
	}
}

class IdleState extends ControllerState {
	public controller: PanController;

	handleMouseDown(event: MouseEvent): boolean {
		this.controller.setState(PanControllerStates.Panning);
		return false;
	}
}

class PanningState extends MouseTrackingControllerState {
	public controller: PanController;
	public initialTranslate: Point;

	handleTrackingStart(delta: MapPoint, event: MouseEvent) {
		this.initialTranslate = this.controller.zoomService.translate;
		return true;
	}

	handleTracking(delta: MapPoint, event: MouseEvent) {
		if (event.buttons) {
			this.controller.zoomService.setTranslate({
				x: delta.x + this.initialTranslate.x,
				y: delta.y + this.initialTranslate.y,
			});
			return true;
		}
	}

	handleTrackingEnd(delta: MapPoint, event: Event) {
		return true;
	}
}
