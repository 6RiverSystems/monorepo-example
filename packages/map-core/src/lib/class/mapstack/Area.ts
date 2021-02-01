import { Rectangle, PolylineOptions, LatLngBounds } from 'leaflet';
import * as uuid from 'uuid';

import { ClassNameUpdater } from '../ClassNameUpdater';
import { LayerType } from '../../interfaces/layer';
import { MapFeature } from '../../interfaces/feature';

export abstract class Area extends Rectangle {
	public id: string = uuid.v4();
	public name = '';
	public classNameUpdater: ClassNameUpdater;

	constructor(
		public readonly type: LayerType,
		latLngBounds: LatLngBounds,
		classes: string[] = [],
		options?: PolylineOptions,
		name?: string,
		id?: string,
	) {
		super(latLngBounds, options);
		if (name) {
			this.name = name;
		}
		if (id) {
			this.id = id;
		}
		this.setStyle({
			fillOpacity: 1.0,
			weight: 1,
		});
		this.classNameUpdater = new ClassNameUpdater(
			() => this.getElement() as HTMLElement,
			id,
			classes,
		);
	}

	onAdd(map: L.Map) {
		super.onAdd(map);
		this.classNameUpdater.syncClasses();
		return this;
	}

	copyFromLayer(layer: MapFeature) {
		this.setBounds((layer as Area).getBounds());
		this.name = layer.name;
	}

	getBounds(): LatLngBounds {
		return super.getBounds();
	}

	/**
	 * Update the editable object
	 */
	refresh() {
		if ((this as any).editor) {
			(this as any).editor.refresh();
			(this as any).editor.reset();
		}
	}
}
