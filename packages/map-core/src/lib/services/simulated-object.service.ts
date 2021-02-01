import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LatLngBounds } from 'leaflet';


export interface SimulatedObjectClass {
    id: string;
    pose: LatLngBounds;
}

@Injectable()
export class SimulatedObjectService {
    private messageSource = new BehaviorSubject<SimulatedObjectClass[]>([]);
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    simulatedObjectMessage(message: SimulatedObjectClass[]) {
        this.messageSource.next(message)
    }
}
