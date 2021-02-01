import { MapPoint, DOMPoint } from '../interfaces/point';
import { Controller, ControllerState } from './controller';

enum PositionControllerStates {
	Idle = 'Idle',
}

/**
 * Displays a div indicating the position of the mouse in Map space
 **/
export class PositionController extends Controller {
	constructor() {
		super();

		this.addState(PositionControllerStates.Idle, new IdleState());
		this.setInitialState(PositionControllerStates.Idle);
	}

	name() {
		return 'PositionController';
	}
}

class IdleState extends ControllerState {
	public controller: PositionController;
	public position: HTMLElement;
	onInstall() {
		this.position = document.createElement('div');
		this.position.classList.add('position-box');
		this.position.style.cssText = 'position: absolute; left: 0; top: 0;';
		this.controller.addWidget('position-box', this.position);
	}

	handleMouseMove(event: MouseEvent): boolean {
		const pos: MapPoint = this.controller.translate(new DOMPoint(event.clientX, event.clientY));
		this.position.innerHTML = `${pos.x.toFixed(3)},${pos.y.toFixed(3)}`;
		return false;
	}
}
