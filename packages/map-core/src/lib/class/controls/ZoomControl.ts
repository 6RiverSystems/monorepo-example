import { Map, Control, ControlOptions, DomUtil, LatLngBounds, latLngBounds } from 'leaflet';

export interface ZoomControlOptions extends ControlOptions {
	zoomInText: string;
	zoomInTitle: string;
	zoomOutText: string;
	zoomOutTitle: string;
	zoomHomeIcon: string;
	zoomHomeTitle: string;
	homeCoordinates: null;
	homeZoom: null;
}

/**
 * Leaflet zoom control with a home button for resetting the view.
 */
export class ZoomControl extends Control.Zoom {
	public options: any;
	private _zoomInButton: any;
	private _zoomOutButton: any;
	private _zoomHomeButton: any;
	private _map: Map;
	constructor(options?: ZoomControlOptions) {
		super(options);

		this.options = options || {
			position: 'bottomright',
			zoomInText: '+',
			zoomInTitle: 'Zoom in',
			zoomOutText: '-',
			zoomOutTitle: 'Zoom out',
			zoomHomeIcon: 'zoom_out_map',
			zoomHomeTitle: 'Fit map to view (spacebar)',
			homeCoordinates: null,
			homeZoom: null,
		};
	}

	onAdd(map: Map): HTMLElement {
		this._map = map;
		const controlName = 'leaflet-control-zoom';
		const container = DomUtil.create('div', controlName + ' leaflet-bar');

		if (this.options.homeCoordinates === null) {
			this.options.homeCoordinates = map.getCenter();
		}
		if (this.options.homeZoom === null) {
			this.options.homeZoom = map.getZoom();
		}
		const self = this as any;
		this._zoomInButton = self._createButton(
			this.options.zoomInText,
			this.options.zoomInTitle,
			`${controlName}-in`,
			container,
			self._zoomIn.bind(this),
		);
		this._zoomOutButton = self._createButton(
			this.options.zoomOutText,
			this.options.zoomOutTitle,
			`${controlName}-out`,
			container,
			self._zoomOut.bind(this),
		);
		const zoomHomeText = `<i class="material-icons">${this.options.zoomHomeIcon}</i>`;
		this._zoomHomeButton = self._createButton(
			zoomHomeText,
			this.options.zoomHomeTitle,
			`${controlName}-home`,
			container,
			this._zoomHome.bind(this),
		);

		self._updateDisabled();
		map.on('zoomend zoomlevelschange', self._updateDisabled, this);

		return container;
	}

	setHomeBounds(bounds: LatLngBounds) {
		if (bounds === undefined) {
			bounds = this._map.getBounds();
		} else if (typeof bounds.getCenter !== 'function') {
			bounds = latLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
		}
		this.options.homeZoom = this._map.getBoundsZoom(bounds);
		this.options.homeCoordinates = bounds.getCenter();
	}

	set homeCoordinates(coordinates) {
		if (coordinates === undefined) {
			coordinates = this._map.getCenter();
		}
		this.options.homeCoordinates = coordinates;
	}

	set homeZoom(zoom) {
		if (zoom === undefined) {
			zoom = this._map.getZoom();
		}
		this.options.homeZoom = zoom;
	}

	get homeZoom() {
		return this.options.homeZoom;
	}

	get homeCoordinates() {
		return this.options.homeCoordinates;
	}

	_zoomHome(e) {
		this._map.setView(this.options.homeCoordinates, this.options.homeZoom, { animate: true });
	}
}
