import {
	Bounds,
	ImageOverlayOptions,
	LatLng,
	divIcon,
	Marker,
	DivIcon,
	Map,
	LatLngBounds,
} from 'leaflet';
import 'leaflet-editable';
import { isEqual } from 'lodash-es';
import * as uuid from 'uuid';
import { svg, render, nothing } from 'lit-html';

import { ClassNameUpdater } from '../ClassNameUpdater';
import { Pose } from '../../interfaces/pose';
import { LayerType } from '../../interfaces/layer';
import { MfpLabel, zoomBadgeThreshold } from './MfpLabel';
import { Mfp as MfpState, MfpDimensions } from '../../interfaces/mfp';

/**
 * Visualize the bounding box of a rotated chuck
 */
const debugBoundingBox = false;
/**
 * When viewing the map at a tiny scale, chucks will take this as a minimum scale to ensure they are always visible
 */
const minChuckScale = 8;

export class MfpDisplay extends Marker {
	type = LayerType.MfpDisplay;
	private opacity = 1;
	public name = '';
	public id: string = uuid.v4();
	// the mfp label has to be in a separate layer, so that it never renders under other mfp's.
	private mfpLabel: MfpLabel;
	private icon: DivIcon = undefined;
	public classNameUpdater: ClassNameUpdater;
	private rootDiv: HTMLElement;
	private iconDiv: HTMLElement;
	private iconSvg: SVGElement;
	private boundsDiv: HTMLElement;
	private highlighterDiv: HTMLElement;

	/**
	 * If a chuck is selected it should show a circle around it
	 */
	private selected = false;
	/**
	 * If a chuck is filtered it does not appear on the map.
	 */
	private filtered = false;
	/**
	 * If a chuck is highlighted it should show a colored circle stroke around it
	 */
	private highlightColor: string | null = null;

	private boundingRect: Bounds; // the rectangle that wraps the rotated mfp icon.
	public pose: Pose;

	constructor(
		public mfpState: MfpState,
		private dwellTimeSec: number,
		options: ImageOverlayOptions,
	) {
		super(new LatLng(mfpState.pose.y, mfpState.pose.x), options);

		this.pose = mfpState.pose;
		this.icon = divIcon({
			html: this.createIcon(),
			className: 'mfp-display',
			iconSize: [0, 0],
		});
		this.setIcon(this.icon);
		this.id = mfpState.id;

		this.classNameUpdater = new ClassNameUpdater(() => this.getElement() as HTMLElement, this.id, [
			'mfp-display',
		]);

		this.setLatLng(new LatLng(this.mfpState.pose.y, this.mfpState.pose.x));
		this.updateClasses();
	}

	/**
	 * When the following properties change in the mfp data,
	 */
	static getRenderingFields() {
		return ['pose', 'faults', 'motionState', 'phase', 'updated'];
	}

	setState(mfpState: MfpState, selected: boolean) {
		// setting the state while animating causes the poor chucks to jump all over the map
		if (!(this._map as any)._animatingZoom) {
			// short circuit state that has not changed
			// phase comes from workflow, so it wont exist in fieldUpdated
			const phaseChange = mfpState.phase !== this.mfpState.phase;
			const poseChange =
				mfpState.pose.orientation !== this.mfpState.pose.orientation ||
				mfpState.pose.x !== this.mfpState.pose.x ||
				mfpState.pose.y !== this.mfpState.pose.y;
			const faultsChange = !isEqual(
				Object.keys(mfpState.faults),
				Object.keys(this.mfpState.faults),
			);
			const motionChange = mfpState.motionState !== this.mfpState.motionState;
			const updatedChange = mfpState.updated !== this.mfpState.updated;
			this.mfpState = mfpState;

			if (poseChange) {
				this.setLatLng(new LatLng(this.mfpState.pose.y, this.mfpState.pose.x));
			}
			if (phaseChange || updatedChange || this.selected !== selected) {
				this.selected = selected;
				this.fullUpdate(this._map.getZoom());
			}
			if (faultsChange || motionChange) {
				this.updateClasses();
			}
		}
	}

	updateOpacity(opacity: number = this.opacity, filtered: boolean = this.filtered) {
		// the opacity of the chuck is a blend of
		// 1. the opacity that is from an inactive chuck that is fading out
		// 2. and the opacity level of a filtered chuck
		if (this.opacity !== opacity || this.filtered !== filtered) {
			this.opacity = opacity;
			this.filtered = filtered;
			const opacityValue = (this.filtered ? 0.25 : 1) * this.opacity;
			this.iconSvg.setAttribute('opacity', opacityValue.toString());
			if (this.mfpLabel) {
				this.mfpLabel.setOpacity(opacityValue);
			}
		}
	}

	setHighlightColor(color: string) {
		this.highlightColor = color;
		if (!(this._map as any)._animatingZoom) {
			const zoom = this._map.getZoom();
			const scale = Math.pow(2, zoom);
			this.updateHighlighter(scale);
		}
	}

	private updateClasses() {
		if (!this.mfpState) return;

		const states = ['faults', 'charging', 'docking', 'idle', 'traveling', 'paused'];
		states.forEach(st => this.classNameUpdater.removeClass(st));

		if (this.mfpState.hasFaults()) {
			this.classNameUpdater.addClass('faults');
		} else if (this.mfpState.isCharging()) {
			this.classNameUpdater.addClass('charging');
		} else if (this.mfpState.isDocking()) {
			this.classNameUpdater.addClass('docking');
		} else if (this.mfpState.isIdle()) {
			this.classNameUpdater.addClass('idle');
		} else if (this.mfpState.isTraveling()) {
			this.classNameUpdater.addClass('traveling');
		} else if (this.mfpState.isPaused()) {
			this.classNameUpdater.addClass('paused');
		}
	}

	private createIcon() {
		const rootDiv = document.createElement('div');
		rootDiv.classList.add('mfp-icon-root');

		const div = document.createElement('div');
		div.classList.add(`mfp-icon-svg`, 'leaflet-zoom-animated');
		rootDiv.appendChild(div);
		this.generateSvg(div);
		this.iconSvg = div.querySelector('svg');
		this.iconDiv = div;

		if (debugBoundingBox) {
			this.boundsDiv = document.createElement('div');
			rootDiv.appendChild(this.boundsDiv);
		}

		this.rootDiv = rootDiv;
		return rootDiv;
	}

	onAdd(map: Map) {
		super.onAdd(map);
		this.classNameUpdater.syncClasses();
		if (!this.mfpLabel) {
			this.mfpLabel = new MfpLabel(new LatLng(this.mfpState.pose.y, this.mfpState.pose.x));
			map.addLayer(this.mfpLabel);
			this.mfpLabel.registerBadge('faults', {
				class: 'faults',
				test: state => state.hasFaults(),
			});
			this.mfpLabel.registerBadge('dwell', {
				class: 'dwell',
				test: state => state.isDwelling(this.dwellTimeSec),
			});
		}

		this.fullUpdate(map.getZoom());
		map.on('zoomend', this._onZoomEnd, this);

		return this;
	}

	onRemove(map: Map) {
		super.onRemove(map);
		map.off('zoomend', this._onZoomEnd, this);
		if (this.mfpLabel) {
			map.removeLayer(this.mfpLabel);
		}
		return this;
	}

	_onZoomEnd() {
		if (this._map) {
			this.fullUpdate(this._map.getZoom());
		}
	}

	_animateZoom(opt: any) {
		this.fullUpdate(opt.zoom);
		(Marker.prototype as any)._animateZoom.bind(this)(opt);
	}

	private generateSvg(parent: HTMLElement) {
		const withPicker = this.mfpState.isPicking();
		const totalWidth = MfpDimensions.width;
		const totalLength = withPicker
			? MfpDimensions.length + MfpDimensions.length / 2
			: MfpDimensions.length;

		/* eslint-disable max-len*/
		const svgElement = svg`
		<svg viewBox="0 0 ${totalWidth} ${totalLength}" style="overflow: visible">
			${
				withPicker
					? svg`
				<circle
					cx="${MfpDimensions.width / 2}"
					cy="${(MfpDimensions.length + MfpDimensions.length / 2) * (5 / 6)}"
					r="${MfpDimensions.length / 5}"
					style="stroke-width: 0; stroke:#000; fill: #555;">`
					: nothing
			}
			<g fill="none" stroke-width="2px" stroke="#555" fill-rule="evenodd" transform="scale(${MfpDimensions.width /
				20},${MfpDimensions.length / 40})">
				<path class="mfp-fill" fill="#D8D8D8" d="m0.9013,3.08058c2.07993,-2.05372 5.11283,-3.08058 9.0987,-3.08058c3.98584,0 7.01873,1.02684 9.09867,3.08054c0.57908,0.57176 0.90133,1.32606 0.90133,2.10972l0,29.14419c0,1.70378 -1.49239,3 -3.33333,3l-13.33333,0c-1.84094,0 -3.33333,-1.3812 -3.33333,-3l0,-29.14416c-0.00001,-0.78367 0.32223,-1.53796 0.9013,-2.10972z"/>
				<rect class="mfp-fill" fill="#B9B9B9" height="7.19828" id="svg_3" rx="2" width="14.36" x="2.82" y="32.73572"/>
			</g>
		</svg>`;
		/* eslint-enable max-len*/

		render(svgElement, parent);
	}

	private updateMfpIcon(scale: number) {
		scale = Math.max(minChuckScale, scale);
		const withPicker = this.mfpState.isPicking();
		const totalWidth = MfpDimensions.width;
		const totalLength = withPicker
			? MfpDimensions.length + MfpDimensions.length / 2
			: MfpDimensions.length;
		const hasPickerClass = this.iconDiv.classList.contains('picker');
		if (withPicker && !hasPickerClass) {
			this.iconDiv.classList.add('picker');
			this.generateSvg(this.iconDiv);
		} else if (!withPicker && hasPickerClass) {
			this.iconDiv.classList.remove('picker');
			this.generateSvg(this.iconDiv);
		}

		this.iconDiv.style.cssText = `
			width: ${totalWidth * 100}px;
			height: ${totalLength * 100}px;
			transform:
				rotateZ(${this.getRotation()}deg)
				scale(${scale / 100})
				translate(${(-totalWidth * 100) / 2}px, ${(-MfpDimensions.length * 100) / 2}px);
			`;
	}

	private updateLabel(scale: number, zoom: number) {
		if (this.mfpLabel !== undefined) {
			const show = zoom > zoomBadgeThreshold || this.selected;
			this.mfpLabel.updateIcon(show, this.boundingRect, this.mfpState.getName(), scale);
			this.mfpLabel.updateBadges(scale, zoom, this.mfpState, this.boundingRect);
		}
	}

	/**
	 * The highlighter circle is used for selection and highlighting chucks that are filtered.
	 */
	private updateHighlighter(scale: number) {
		const padding = 0.2;
		if ((this.selected || this.highlightColor) && !this.highlighterDiv) {
			const highlighter = document.createElement('div');
			highlighter.classList.add('highlighter', 'leaflet-zoom-animated');
			this.rootDiv.insertBefore(highlighter, this.rootDiv.firstChild);
			this.highlighterDiv = highlighter;
			this.setZIndexOffset(99999);
			this.mfpLabel.setZIndexOffset(99999);
		} else if (!this.selected && !this.highlightColor && this.highlighterDiv) {
			this.highlighterDiv.remove();
			this.highlighterDiv = undefined;
			this.setZIndexOffset(0);
			this.mfpLabel.setZIndexOffset(0);
		}
		if (this.highlighterDiv) {
			const transformScale = scale / 100 + padding;
			const diameter = MfpDimensions.length * 100;
			this.highlighterDiv.style.cssText = `
				width: ${diameter}px;
				height: ${diameter}px;
				border-color: ${this.highlightColor || 'none'};
				border-width: ${Math.ceil(4 / transformScale)}px;
				transform: 
					scale(${transformScale}) 
					translate(${-diameter / 2}px, ${-diameter / 2}px);
				`;
		}
	}

	private fullUpdate(zoom: number) {
		const scale = Math.pow(2, zoom);
		this.updateHighlighter(scale);
		this.updateMfpIcon(scale);
		this.updateLabel(scale, zoom);
		if (zoom > zoomBadgeThreshold) {
			this.classNameUpdater.removeClass('color-state');
		} else {
			this.classNameUpdater.addClass('color-state');
		}
	}

	copyFromLayer(layer: MfpDisplay) {
		// no op for Mfp's because they are not editable
	}

	private getRotation(): number {
		let orientation = -(this.mfpState.pose.orientation - 90);

		// sanity check: 0 <= orientation <= 360
		if (orientation > 360) {
			orientation -= 360;
		} else if (orientation < 0) {
			orientation += 360;
		}
		orientation = Math.round(orientation);
		return orientation;
	}

	private updateBoundingBox() {
		const withPicker = this.mfpState.isPicking();

		const theta = ((this.mfpState.pose.orientation + 90) * Math.PI) / 180; // Shifted to make 0 degrees north.
		const width = MfpDimensions.width;
		const height = MfpDimensions.length;
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const sinTheta = Math.sin(theta);
		const cosTheta = Math.cos(theta);
		const boundingRect: Bounds = [
			[-halfWidth, -(withPicker ? halfHeight * 2 : halfHeight)],
			[halfWidth, -(withPicker ? halfHeight * 2 : halfHeight)],
			[halfWidth, halfHeight],
			[-halfWidth, halfHeight],
		]
			.map(point => [
				sinTheta * point[1] - cosTheta * point[0],
				sinTheta * point[0] + cosTheta * point[1],
			])
			.reduce((bounds, point: [number, number]) => bounds.extend(point), new Bounds([]));
		this.boundingRect = boundingRect;
	}

	getBounds() {
		// this is not accurate because it does not account for rotation.
		const latLng = this.getLatLng();
		return new LatLngBounds(
			new LatLng(latLng.lat - MfpDimensions.length / 2, latLng.lng - MfpDimensions.width / 2),
			new LatLng(latLng.lat + MfpDimensions.length / 2, latLng.lng + MfpDimensions.width / 2),
		);
	}

	setLatLng(latLng: LatLng) {
		super.setLatLng(latLng);
		this.pose.x = latLng.lng;
		this.pose.y = latLng.lat;

		this.updateBoundingBox();

		if (this._map) {
			const zoom = this._map.getZoom();
			const scale = Math.pow(2, zoom);
			// update only things that are affected by the pose
			this.updateMfpIcon(scale);
			this.updateLabel(scale, zoom);

			if (debugBoundingBox) {
				this.boundsDiv.style.cssText = `position: absolute;
					border: solid black 1px;
					left: ${this.boundingRect.min.x * scale}px;
					top: ${this.boundingRect.min.y * scale}px;
					width: ${(this.boundingRect.max.x - this.boundingRect.min.x) * scale}px;
					height: ${(this.boundingRect.max.y - this.boundingRect.min.y) * scale}px;
				`;
			}
		}
		if (this.mfpLabel) {
			this.mfpLabel.setLatLng(latLng);
		}
		return this as any;
	}
}
