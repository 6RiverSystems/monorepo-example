import { Map, Control, ControlOptions, DomUtil, DomEvent, ControlPosition } from 'leaflet';

import { labels } from '../../i18n/labels';

export class OccupancyGridControl extends Control {
	public options: any;
	private input: HTMLElement;

	protected container: HTMLElement;

	constructor(position: ControlPosition) {
		super({ position });
	}

	onAdd(map: Map): HTMLElement {
		this.container = DomUtil.create('div', 'leaflet-control leaflet-bar');

		const node = document.createElement('a');
		const glyph = document.createElement('i');
		glyph.classList.add('material-icons');
		glyph.innerText = 'map';
		node.style.cursor = 'pointer';
		node.setAttribute('title', 'Upload a new occupancy grid');
		node.setAttribute('href', '#');
		node.appendChild(glyph);
		this.container.appendChild(node);

		DomEvent.on(this.container, 'click', DomEvent.stop).on(
			this.container,
			'click',
			() => {
				document.getElementById('occupancyGridUpload').click();
			},
			this,
		);

		return this.container;
	}
}
