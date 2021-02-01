import { ImageOverlay, LatLngBounds } from 'leaflet';
import * as uuid from 'uuid';

import { LayerType } from '../../interfaces/layer';
import { ClassNameUpdater } from '../ClassNameUpdater';

export class OccupancyGrid extends ImageOverlay {
	public id: string = uuid.v4();
	public name = '';
	public classNameUpdater: ClassNameUpdater;

	constructor(
		public readonly type: LayerType,
		latLngBounds: LatLngBounds,
		imageObjectUrl: string,
		name?: string,
		id?: string,
	) {
		super(imageObjectUrl, latLngBounds);
		if (name) {
			this.name = name;
		}
		if (id) {
			this.id = id;
		}

		this.classNameUpdater = new ClassNameUpdater(() => this.getElement() as HTMLElement, id, []);
	}
}
