import * as L from 'leaflet';
import 'leaflet-editable';
import * as uuid from 'uuid';

import { ClassNameUpdater } from '../ClassNameUpdater';
import { Pose } from '../../interfaces/pose';
import { LayerType } from '../../interfaces/layer';
import { MapFeature } from '../../interfaces/feature';
import { RotatedMarker } from './RotatedMarker';
import { WorkflowPointState } from '../../interfaces/workflow-point-state';
import { DisplayOptionsService } from '../../services/display-options.service';
import { DisplayOptions } from '../../interfaces/map-display-options';

const workflowPointSize = 5;
export class WorkflowPoint extends RotatedMarker {
	type = LayerType.WorkflowPoint;

	public name = '';
	public labels: string[] = [];
	public workflowOptions: string[] = [];
	public id: string = uuid.v4();
	private icon: L.DivIcon = undefined;
	public classNameUpdater: ClassNameUpdater;
	public enabled = true;
	public target: string;

	constructor(public pose: Pose, options: L.ImageOverlayOptions, id?: string) {
		super(pose, { rotationOrigin: 'center' } as L.MarkerOptions);

		this.icon = L.divIcon({
			className: 'workflow-icon',
			iconSize: [workflowPointSize, workflowPointSize],
		});
		this.setIcon(this.icon);

		if (id && id.length > 0) {
			this.id = id;
		}

		this.classNameUpdater = new ClassNameUpdater(() => this.getElement() as HTMLElement, id, [
			'stack-workflow-point',
		]);

		(this as any).options.rotationAngle = this._getRotation();
	}

	onAdd(map: L.Map) {
		super.onAdd(map);
		this.classNameUpdater.syncClasses();

		this._refreshIcon(map.getZoom());
		map.on('zoomend', this._onZoomEnd, this);

		return this;
	}

	onRemove(map: L.Map) {
		super.onRemove(map);
		map.off('zoomend', this._onZoomEnd, this);

		return this;
	}

	_onZoomEnd() {
		if (this._map) {
			this._refreshIcon(this._map.getZoom());
		}
	}

	_animateZoom(opt: any) {
		this._refreshIcon(opt.zoom);
		(L.Marker.prototype as any)._animateZoom.bind(this)(opt);
	}

	_refreshIcon(zoom: number) {
		const minZoom = 1; // 5 px
		const maxZoom = 8; // 40 px
		zoom = Math.min(maxZoom, Math.max(1, zoom - minZoom));

		(this.icon as any).options.iconSize = [workflowPointSize * zoom, workflowPointSize * zoom];
		this.setIcon(this.icon);
		this.classNameUpdater.syncClasses();
	}

	copyFromLayer(layer: MapFeature) {
		this.name = layer.name;
		this.labels = (layer as WorkflowPoint).labels;
		if ((layer as WorkflowPoint).workflowOptions.length > 0) {
			this.workflowOptions = (layer as WorkflowPoint).workflowOptions;
		} else {
			this.workflowOptions = [''];
		}
		this.pose.orientation = (layer as WorkflowPoint).pose.orientation;
		this.setLatLng(new L.LatLng((layer as WorkflowPoint).pose.y, (layer as WorkflowPoint).pose.x));
	}

	_getRotation(): number {
		const pose = this.pose;
		let orientation = -pose.orientation;

		// sanity check: 0 <= orientation <= 360
		if (orientation > 360) {
			orientation -= 360;
		} else if (orientation < 0) {
			orientation += 360;
		}

		return orientation;
	}

	setLatLng(latlng: L.LatLng) {
		super.setLatLng(latlng);
		this.pose.x = latlng.lng;
		this.pose.y = latlng.lat;
		(this as any).options.rotationAngle = this._getRotation();
		return this as any;
	}

	refresh() {
		if ((this as any).editor) {
			(this as any).editor.reset();
		}
	}

	updateEnabledState(workflowPointState: WorkflowPointState) {
		this.enabled = workflowPointState.enabled;
		if (this.enabled) {
			this.classNameUpdater.removeClass('disabled');
		} else {
			this.classNameUpdater.addClass('disabled');
		}
	}
}
