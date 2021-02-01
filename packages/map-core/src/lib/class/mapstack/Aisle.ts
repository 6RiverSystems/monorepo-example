import * as L from 'leaflet';
import 'leaflet-editable';
import * as uuid from 'uuid';

import { LayerType } from '../../interfaces/layer';
import { MapFeature } from '../../interfaces/feature';
import { ClassNameUpdater } from '../ClassNameUpdater';

const aisleEditor = (L as any).Editable.PolylineEditor.extend({
	hasMiddleMarkers() {
		return false;
	},
	processDrawingClick(e: any) {
		if (e.vertex && e.vertex.editor === this) {
			return;
		}
		if (this._drawing === (L as any).Editable.FORWARD) {
			this.newPointForward(e.latlng);
		} else {
			this.newPointBackward(e.latlng);
		}
		this.fireAndForward('editable:drawing:clicked', e);

		if (this._drawnLatLngs.length > 1) {
			this.commitDrawing(e);
			return; // Only draw two points
		}
	},
});

export class Aisle extends L.Polyline {
	type = LayerType.Aisle;
	public directed = true;
	public name = '';
	public labels: string[] = [];
	public id: string = uuid.v4();
	public classNameUpdater: ClassNameUpdater;

	constructor(latlngs: L.LatLng[], options: any = {}, name?: string, id?: string) {
		super(latlngs, options);
		if (name) {
			this.name = name;
		}
		if (id) {
			this.id = id;
		}

		// Guard against the possibility of not getting a valid location and crashing.
		if (latlngs.length === 0) {
			latlngs.push(new L.LatLng(0, 0));
			latlngs.push(new L.LatLng(0, 0));
		}

		this.classNameUpdater = new ClassNameUpdater(() => this.getElement() as HTMLElement, id, [
			'stack-aisle',
		]);
	}

	/**
	 * Creates a marker definition in the SVG Pane for the arrows at the end of the Aisles.
	 * The marker definition is created once, and a zoom event will update the marker size.
	 * The arrow is scaled so that it is perceived to be the same size regardless of the zoom level.
	 */
	private customizeRenderer(map: L.Map) {
		const svgElement = (this as any).getPane().firstElementChild;
		const markerWidth = 5;

		if (!svgElement.querySelector('#stack-aisle-arrow')) {
			const svgNS = 'http://www.w3.org/2000/svg';
			const defs = document.createElementNS(svgNS, 'defs');
			const marker = document.createElementNS(svgNS, 'marker');
			const path = document.createElementNS(svgNS, 'path');
			marker.setAttribute('id', 'stack-aisle-arrow');
			const makeArrow = function() {
				const minZoom = 1;
				const maxZoom = 6;
				const zoom = Math.min(maxZoom, Math.max(1, map.getZoom() - minZoom));
				const base = markerWidth * zoom;

				marker.setAttribute('viewBox', `0 0 ${base} ${base}`);
				marker.setAttribute('markerWidth', String(base));
				marker.setAttribute('markerHeight', String(base));
				marker.setAttribute('refX', String(base - 3));
				marker.setAttribute('refY', String(base / 2));
				path.setAttribute('d', `M0,0 L0,${base} L${base},${base / 2} z`);
			};
			marker.setAttribute('orient', 'auto');
			marker.setAttribute('markerUnits', 'userSpaceOnUse');
			makeArrow();
			defs.appendChild(marker);
			marker.appendChild(path);
			svgElement.appendChild(defs);

			map.on('zoom', makeArrow);
		}
	}

	copyFromLayer(layer: MapFeature) {
		this.setLatLngs((layer as Aisle).getLatLngs());

		this.name = layer.name;
		this.directed = (layer as Aisle).directed;
		this.labels = (layer as Aisle).labels;
	}

	onAdd(map: L.Map) {
		super.onAdd(map);
		this.classNameUpdater.syncClasses();
		this.customizeRenderer(map);

		if (this.directed) {
			this.updateArrow();
		}
		return this;
	}

	updateArrow() {
		const path: SVGPathElement = (this as any).getElement();
		if (path) {
			if (this.directed) {
				path.setAttribute('marker-end', 'url(#stack-aisle-arrow)');
			} else {
				path.removeAttribute('marker-end');
			}
		}
	}

	getEditorClass() {
		return aisleEditor;
	}

	// hide the arrow if the path is not in the view.
	// Leaflet never expected people to put SVG markers on paths. When a path is outside the view
	// Leaflet removes the points and give it a 'M0 0' path. With out SVG marker implementation
	// the invalid path causes the SVG marker to appear in the middle of the map.
	// This is how we can patch the Polyline so that it will hide the marker if the path is off view.
	_update() {
		(L.Polyline.prototype as any)._update.bind(this)();
		if (!(this as any)._parts.length) {
			const path: SVGPathElement = (this as any).getElement();
			path.removeAttribute('marker-end');
		} else {
			this.updateArrow();
		}
	}

	// Redraw the object.
	refresh() {
		this.updateArrow();
		if ((this as any).editor) {
			(this as any).editor.reset();
		}
	}
}
