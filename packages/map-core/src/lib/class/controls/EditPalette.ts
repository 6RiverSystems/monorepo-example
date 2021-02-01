import { Map, Control, ControlOptions, DomUtil, DomEvent } from 'leaflet';
import { EventEmitter } from '@angular/core';

import { MapEvents } from '../../interfaces/events';
import { editControls } from './EditControls';

export type EditPaletteOptions = ControlOptions;

/**
 * Leaflet zoom control with a home button for resetting the view.
 */
export class EditPalette extends Control {
	public options: any;
	private controls: { [key: string]: HTMLElement } = {};
	private _map: Map;
	private editControls;
	constructor(mapEmitter: EventEmitter<MapEvents>,
		paletteType: string,
		options?: EditPaletteOptions) {
		super(options);

		this.options = options || {
			position: 'topleft',
		};
		this.editControls = editControls(paletteType, { mapEmitter });
	}

	onAdd(map: Map): HTMLElement {
		this._map = map;
		const controlName = 'leaflet-control-palette';
		const container = DomUtil.create('div', controlName + ' leaflet-bar');

		this.editControls.forEach(control => {
			const html = control.html;
			const title = 'Create a new ' + control.kind;
			const id = control.kind.replace(/\s/g, '');

			const callback = () => {
				control.create(map);
				this.onActivate(id);
			};
			const link = this.createButton(html, title, 'edit-control', container, callback);
			link.setAttribute('data-tag', id); // for e2e
			this.controls[id] = link;
		});

		return container;
	}

	private createButton(
		html: string,
		title: string,
		className: string,
		container: HTMLElement,
		fn: () => void,
	) {
		const link = <HTMLLinkElement>DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		DomEvent.on(link, 'click', DomEvent.stop).on(link, 'click', fn, this);
		DomEvent.disableClickPropagation(link);

		return link;
	}

	private onActivate(id: string) {
		const control = this.controls[id];
		control.classList.add('active');
		this._map.once('editable:drawing:end', (e: any) => {
			control.classList.remove('active');
		});
	}
}
