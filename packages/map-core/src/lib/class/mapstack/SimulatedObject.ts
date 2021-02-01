import { PolylineOptions, LatLngBounds } from 'leaflet';
import { EventEmitter } from '@angular/core';

import { Area } from './Area';
import { LayerType } from '../../interfaces/layer';
import { MapEvents } from '../../interfaces/events';

export class SimulatedObject extends Area {
    type = LayerType.SimulatedObject;
    private mapEmitter: EventEmitter<MapEvents>;
    private externallyCreated: boolean;

    constructor(latLngBounds: LatLngBounds, options?: PolylineOptions, name?: string, id?: string) {
        super(LayerType.SimulatedObject, latLngBounds, ['stack-simulated-object'], options, name, id);
        this.mapEmitter = options ? (options as any).mapEmitter : undefined;
        this.externallyCreated = options ? (options as any).externallyCreated : undefined;

    }

    afterAdd() {
        if (this.mapEmitter && !this.externallyCreated) {
            this.mapEmitter.emit({ type: 'sim-obj-create', id: this.id, pose: this.getBounds() });
        }
    }
    onRemove(map: L.Map): this {
        if (this.mapEmitter) {
            this.mapEmitter.emit({ type: 'sim-obj-delete', id: this.id });
        }
        return super.onRemove(map);
    };
}
