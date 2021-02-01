// source: https://github.com/bbecquet/Leaflet.RotatedMarker

import * as L from 'leaflet';

import { Pose } from '../../interfaces/pose';

export interface RotatedMarkerOptions extends L.MarkerOptions {
	rotationOrigin: string | L.PointExpression;
	rotationAngle: number;
}

export class RotatedMarker extends L.Marker {
	public options: RotatedMarkerOptions;

	constructor(public pose: Pose, options: L.ImageOverlayOptions) {
		super(new L.LatLng(pose.y, pose.x), { rotationOrigin: 'center' } as L.MarkerOptions);

		const oldIE = L.DomUtil.TRANSFORM === 'msTransform';

		const iconOptions = this.options.icon && this.options.icon.options;
		let iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
		if (iconAnchor) {
			iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px') as any;
		}
		this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
		this.options.rotationAngle = this.options.rotationAngle || 0;

		// Ensure marker keeps rotated during dragging
		// this was causing a bug where the markers kept rotating as we were dragging
		// this.on('drag', function(e) {
		// 	e.target._applyRotation();
		// });
	}

	_initIcon() {
		(L.Marker.prototype as any)._initIcon.call(this);
	}

	_setPos(pos) {
		(L.Marker.prototype as any)._setPos.call(this, pos);
		this._applyRotation();
	}

	_applyRotation() {
		if (this.options.rotationAngle) {
			const icon = (this as any)._icon;
			icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

			// for modern browsers, prefer the 3D accelerated version
			icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
		}
	}

	setRotationAngle(angle) {
		this.options.rotationAngle = angle;
		(this as any).update();
		return this;
	}

	setRotationOrigin(origin) {
		this.options.rotationOrigin = origin;
		(this as any).update();
		return this;
	}
}
