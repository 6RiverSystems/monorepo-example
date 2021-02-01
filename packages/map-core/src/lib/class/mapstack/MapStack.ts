import * as L from 'leaflet';
import { ConnectivityMatrix } from '@sixriver/map-io';

import { WorkflowPoint } from './WorkflowPoint';
import { Area } from './Area';
import { Aisle } from './Aisle';
import { KeepOutArea } from './KeepOutArea';
import { CostArea } from './CostArea';
import { QueueArea } from './QueueArea';
import { StayOnPathArea } from './StayOnPathArea';
import { SpeedLimitArea } from './SpeedLimitArea';
import { WeightedArea } from './WeightedArea';
import { ImpassableArea } from './ImpassableArea';
import { SimulatedObject } from './SimulatedObject';
import { OccupancyGrid } from './OccupancyGrid';
import { LayerType } from '../../interfaces/layer';

/**
 * Container/Interface to all the Leaflet Layers and Leaflet groups.
 */
export class MapStack {
	public name = '';
	public buildNumber: number; // Not sure we need this.
	public resolution = 0.05; // Resolution of the map in m
	public origin: number[] = [0, 0, 0]; // 3 element array in m

	public baseFileName = '';

	public workflowPoints: L.FeatureGroup<WorkflowPoint>;
	public aisles: L.FeatureGroup<Aisle>;
	public connectivityMatrix: ConnectivityMatrix;
	public occupancyGrid: OccupancyGrid;
	public occupancyGridBlob: Blob;
	public occupancyGridGroup: L.FeatureGroup<OccupancyGrid>;

	private _layerIdCache: Map<string, any>;

	public areas: Map<string, L.FeatureGroup<any>> = new Map<string, L.FeatureGroup<any>>([
		[LayerType.KeepOutArea, new L.FeatureGroup<KeepOutArea>()],
		[LayerType.CostArea, new L.FeatureGroup<CostArea>()],
		[LayerType.QueueArea, new L.FeatureGroup<QueueArea>()],
		[LayerType.StayOnPathArea, new L.FeatureGroup<StayOnPathArea>()],
		[LayerType.SpeedLimitArea, new L.FeatureGroup<SpeedLimitArea>()],
		[LayerType.WeightedArea, new L.FeatureGroup<WeightedArea>()],
		[LayerType.ImpassableArea, new L.FeatureGroup<ImpassableArea>()],
	]);

	constructor({
		name = '',
		buildNumber = -1,
		resolution = 0.05,
		origin = [0, 0, 0],
		workflowPoints = new L.FeatureGroup<WorkflowPoint>(),
		aisles = new L.FeatureGroup<Aisle>(),
		connectivityMatrix = new ConnectivityMatrix(),
		occupancyGridImage = new Image(),
		occupancyGridBlob = new Blob(),
	}) {
		this.name = name;
		this.buildNumber = buildNumber;
		this.resolution = resolution;
		this.origin = origin;
		this.workflowPoints = workflowPoints;
		this.aisles = aisles;
		this.connectivityMatrix = connectivityMatrix;
		this.occupancyGridBlob = occupancyGridBlob;
		this.occupancyGridGroup = new L.FeatureGroup<OccupancyGrid>();
		this._layerIdCache = new Map<string, L.Layer>();

		// calculate the edges of the image, in coordinate space
		const bounds = this.getBoundsFromImageOrigin(occupancyGridImage, origin);

		this.occupancyGrid = new OccupancyGrid(LayerType.OccupancyGrid, bounds, occupancyGridImage.src);
	}

	addLayer(layer: L.Layer) {
		const _layer = layer as any;
		// Check the type and push into the correct spot.
		const group: L.FeatureGroup<any> = this.findLayerGroup(layer);
		if (!group) {
			throw new Error(`Unknown layer type: ${typeof layer}`);
		}
		group.addLayer(layer);
		this._layerIdCache.set(_layer.id, layer);
	}

	removeLayer(layer: L.Layer) {
		const _layer = layer as any;
		this.findLayerGroup(layer).removeLayer(_layer);
		_layer.remove();
		if (!this._layerIdCache.has(_layer.id)) {
			throw new Error(`layer cache is corrupt for ${layer}`);
		}
		this._layerIdCache.delete(_layer.id);
	}

	/**
	 * Find a layer group in the map stack by the type of layer passed in.
	 * @param layer
	 */
	findLayerGroup(layer: L.Layer): L.FeatureGroup<Aisle | Area | WorkflowPoint> {
		if (layer instanceof Area) {
			return this.areas.get((layer as Area).type);
		} else if (layer instanceof WorkflowPoint) {
			return this.workflowPoints;
		} else if (layer instanceof Aisle) {
			return this.aisles;
		} else {
			throw new Error(`cannot handle layers of type ${typeof layer}`);
		}
	}

	findLayer(id: string) {
		return this._layerIdCache.get(id);
	}

	changeOccupancyGrid(
		occupancyGridImage: HTMLImageElement,
		occupancyGridBlob: Blob,
	): L.FeatureGroup<OccupancyGrid> {
		this.occupancyGridBlob = occupancyGridBlob;
		const bounds = this.getBoundsFromImageOrigin(occupancyGridImage, this.origin);
		this.occupancyGridGroup.removeLayer(this.occupancyGrid);
		this.occupancyGrid = new OccupancyGrid(LayerType.OccupancyGrid, bounds, occupancyGridImage.src);
		this.occupancyGridGroup.addLayer(this.occupancyGrid);
		return this.occupancyGridGroup;
	}

	getBoundsFromImageOrigin(
		occupancyGridImage: HTMLImageElement,
		origin: Array<number>,
	): L.LatLngBounds {
		return new L.LatLngBounds(
			new L.LatLng(origin[1], origin[0]),
			new L.LatLng(
				occupancyGridImage.height * this.resolution + origin[1],
				occupancyGridImage.width * this.resolution + origin[0],
			),
		);
	}

	getBounds() {
		// TODO: Figure out why typescript is generating errors for something that is defined.
		return (this.occupancyGrid as any).getBounds();
	}
}
