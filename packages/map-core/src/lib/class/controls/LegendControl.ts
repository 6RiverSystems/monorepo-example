import { Map, Control, DomUtil, DomEvent, ControlPosition } from 'leaflet';

import { labels } from '../../i18n/labels';
import { MotionState } from '../../interfaces/mfp';

export class LegendControl extends Control {
	public options: any;

	protected container: HTMLElement;
	protected colorStates: Array<any>;

	constructor(position: ControlPosition) {
		super({ position });
	}

	onAdd(map: Map): HTMLElement {
		this.container = DomUtil.create('div', 'leaflet-control leaflet-bar mfp-state-legend');

		this.colorStates = this._getColorStates();

		// add legend icon content
		this._setInitialState();

		DomEvent.on(this.container, 'mouseleave', DomEvent.stop).on(
			this.container,
			'mouseleave',
			() => {
				// set inner html to legend icon content
				this._setInitialState();
			},
		);

		DomEvent.on(this.container, 'mouseenter', DomEvent.stop).on(
			this.container,
			'mouseenter',
			() => {
				this._setHoverState();
			},
			this,
		);

		return this.container;
	}

	_setInitialState() {
		this.container.innerHTML = 'Legend';
		this.container.style.color = 'black';
		this.container.style.backgroundColor = 'white';
		this.container.style.fontSize = '15px';
		this.container.style.padding = '5px';
	}

	_setHoverState() {
		// clear contents
		this.container.innerHTML = '';

		// add legend
		this.colorStates.forEach(colorState => {
			const colorDisplay: any = DomUtil.create('i', '', this.container);
			const stateDisplay: any = DomUtil.create('span', '', this.container);
			const br: any = DomUtil.create('br', '', this.container);

			colorDisplay.style.background = colorState.color;
			colorDisplay.style.width = '18px';
			colorDisplay.style.height = '18px';
			colorDisplay.style.float = 'left';
			colorDisplay.style.marginRight = '8px';
			colorDisplay.style.position = 'absolute';

			stateDisplay.innerText = colorState.stateDisplay;
			stateDisplay.style.marginLeft = '25px';
		});

		this.container.style.fontSize = '15px';
	}

	_getColorStates(): Array<{ stateDisplay: string; color: string }> {
		return [
			{
				stateDisplay: `${labels.MotionState.get(MotionState.DOCKING)}/${labels.MotionState.get(
					MotionState.CHARGING,
				)}`,
				color: '#874493',
			},
			{
				stateDisplay: labels.MotionState.get(MotionState.IDLE),
				color: '#0000FF',
			},
			{
				stateDisplay: labels.MotionState.get(MotionState.TRAVELING),
				color: '#32CD32',
			},
			{
				stateDisplay: labels.MotionState.get(MotionState.PAUSED),
				color: '#FFDD00',
			},
			{
				stateDisplay: labels.Faults,
				color: '#FF0000',
			},
		];
	}
}
