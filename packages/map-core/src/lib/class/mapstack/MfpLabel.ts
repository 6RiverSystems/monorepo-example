import * as L from 'leaflet';

import { Mfp as MfpState } from '../../interfaces/mfp';

export class Badge {
	class: 'faults' | 'dwell';
	element?: HTMLElement;
	test: (mfp: MfpState) => boolean;
}

export const zoomBadgeThreshold = 4;

export class MfpLabel extends L.Marker {
	private rootDiv: HTMLElement;
	private caption: HTMLElement;
	private badges: { [key: string]: Badge } = {};

	constructor(position: L.LatLng, options: L.MarkerOptions = {}) {
		super(position, Object.assign(options, { interactive: false, pane: 'mfpLabelsPane' }));

		this.rootDiv = document.createElement('div');
		this.caption = document.createElement('div');
		this.caption.classList.add('caption', 'leaflet-zoom-animated');
		this.caption.style.cssText = 'display: none';
		this.rootDiv.appendChild(this.caption);

		this.setIcon(
			new L.DivIcon({
				className: 'mfp-label',
				html: this.rootDiv,
				iconSize: [1, 1],
			}),
		);
	}

	onRemove(map: L.Map) {
		super.onRemove(map);
		Object.values(this.badges).forEach(badge => {
			if (badge.element) {
				badge.element.remove();
				badge.element = undefined;
			}
		});
		return this;
	}

	registerBadge(id: string, badge: Badge) {
		this.badges[id] = badge;
	}

	updateBadges(scale: number, zoom: number, state: MfpState, bounds: L.Bounds) {
		const diameter = 20;
		let offset = 0;
		Object.values(this.badges).forEach(badge => {
			const show = badge.test(state);
			if (show) {
				if (!badge.element) {
					const div = document.createElement('div');
					div.classList.add('badge', badge.class, 'leaflet-zoom-animated');
					badge.element = div;
					this.rootDiv.appendChild(div);
				}
				badge.element.style.cssText = `
					display: ${zoom > zoomBadgeThreshold ? 'initial' : 'none'};
					width: ${diameter}px;
					height: ${diameter}px;
					transform:
						translate(${bounds.max.x * scale - diameter / 2}px,
							${bounds.max.y * scale - diameter - offset}px);
				`;
				offset += diameter;
			} else if (badge.element) {
				badge.element.remove();
				badge.element = undefined;
			}
		});
	}

	updateIcon(show: boolean, bounds: L.Bounds, name: string, scale: number) {
		// This involves shifting the caption by the same amount of space as we shift the svg
		// plus half the size of the final width of the svg so it lines up to the middle of the mfp svg.
		const LabelSpacing = 8; // Create some spacing between the bottom of the chuck and the label.
		const offset = bounds.max.y * scale + LabelSpacing;
		if (show) {
			// Only display labels when the width of a chuck is bigger than 10
			this.caption.style.cssText = `transform: translate(-50%, ${offset}px);`;
		} else {
			this.caption.style.cssText = 'display: none';
		}
		this.caption.textContent = name;
	}
}
