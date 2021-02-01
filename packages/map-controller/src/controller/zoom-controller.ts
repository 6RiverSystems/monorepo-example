import { DOMPoint } from '../interfaces/point';
import { Controller, ControllerState } from './controller';
import { ZoomService } from '../interfaces/zoom-service';

enum ZoomControllerStates {
	Idle = 'Idle',
	BoxZoom = 'BoxZoom',
}

export class ZoomController extends Controller {
	constructor(public zoomService: ZoomService) {
		super();

		this.addState(ZoomControllerStates.Idle, new IdleState());

		this.setInitialState(ZoomControllerStates.Idle);
	}

	name() {
		return 'ZoomController';
	}
}

const factor = 0.005;

class IdleState extends ControllerState {
	public controller: ZoomController;

	handleWheel(event: WheelEvent): boolean {
		const currentScale = this.controller.zoomService.scale;

		const zoomPoint = this.controller.translate(new DOMPoint(event.clientX, event.clientY));

		const delta = event.deltaY;
		const newScale = currentScale + delta * -1 * factor * currentScale;

		this.controller.zoomService.scaleAroundPoint(newScale, zoomPoint);
		return true;
	}
}
