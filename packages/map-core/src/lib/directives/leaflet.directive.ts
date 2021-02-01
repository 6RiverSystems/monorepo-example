import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	NgZone,
	OnChanges,
	OnInit,
	Output,
	SimpleChange,
	HostListener,
} from '@angular/core';
import { latLng, LatLng, LatLngBounds, map, Map } from 'leaflet';

import { MapStack } from '../class/mapstack/MapStack';

const DEFAULT_ZOOM = 1;
const DEFAULT_CENTER = latLng(38.907192, -77.036871);
const DEFAULT_FPZ_OPTIONS = {};

@Directive({
	selector: '[appLeaflet]',
})
export class LeafletDirective implements OnChanges, OnInit {
	// Reference to the primary map object
	map: Map;

	@Input('leafletFitBoundsOptions') fitBoundsOptions = DEFAULT_FPZ_OPTIONS;
	@Input('leafletPanOptions') panOptions = DEFAULT_FPZ_OPTIONS;
	@Input('leafletZoomOptions') zoomOptions = DEFAULT_FPZ_OPTIONS;
	@Input('leafletZoomPanOptions') zoomPanOptions = DEFAULT_FPZ_OPTIONS;

	// Default configuration
	@Input('leafletOptions') options: any = {};

	// Configure callback function for the map
	@Output('leafletMapReady') mapReady = new EventEmitter<Map>();

	// Broadcast keyboard events that happen when the map directive is in focus
	@Output('leafletMapKeyEvent') mapKeyEvent = new EventEmitter<KeyboardEvent>();

	// Zoom level for the map
	@Input('leafletZoom') zoom: number;

	// Center the map
	@Input('leafletCenter') center: LatLng;

	// Set fit bounds for map
	@Input('leafletFitBounds') fitBounds: LatLngBounds;

	// The map stack.
	@Input('mapStack') mapStack: MapStack;

	constructor(private element: ElementRef, private zone: NgZone) {
		// Nothing here
	}

	ngOnInit() {
		/*
		 * Create the map outside of angular so the various map events don't trigger change detection
		 */
		this.zone.runOutsideAngular(() => {
			// Create the map with some reasonable defaults
			this.map = map(this.element.nativeElement, this.options);
		});

		// Only setView if there is a center/zoom
		if (this.center && this.zoom) {
			this.setView(this.center, this.zoom);
		}

		// Set up all the initial settings
		if (this.fitBounds) {
			this.setFitBounds(this.fitBounds);
		}

		// Fire map ready event
		this.mapReady.emit(this.map);
	}

	ngOnChanges(changes: { [key: string]: SimpleChange }) {
		/*
		 * The following code is to address an issue with our (basic) implementation of
		 * zooming and panning. From our testing, it seems that a pan operation followed
		 * by a zoom operation in the same thread will interfere with each other. The zoom
		 * operation interrupts/cancels the pan, resulting in a final center point that is
		 * inaccurate. The solution seems to be to either separate them with a timeout or
		 * to collapse them into a setView call.
		 */

		// Zooming and Panning
		if (changes['zoom'] && changes['center'] && null !== this.zoom && null !== this.center) {
			this.setView(changes['center'].currentValue, changes['zoom'].currentValue);
			// Set the zoom level
		} else if (changes['zoom']) {
			this.setZoom(changes['zoom'].currentValue);
			// Set the map center
		} else if (changes['center']) {
			this.setCenter(changes['center'].currentValue);
		}

		// Fit bounds
		if (changes['fitBounds']) {
			this.setFitBounds(changes['fitBounds'].currentValue);
		}
	}

	@HostListener('keyup', ['$event'])
	onKey(event: KeyboardEvent) {
		this.mapKeyEvent.emit(event);
	}

	public getMap() {
		return this.map;
	}

	public getMapStack() {
		return this.mapStack;
	}

	/**
	 * Set the view (center/zoom) all at once
	 * @param center The new center
	 * @param zoom The new zoom level
	 */
	private setView(center: LatLng, zoom: number) {
		if (this.map && null !== center && null !== zoom) {
			this.map.setView(center, zoom, this.zoomPanOptions);
		}
	}

	/**
	 * Set the map zoom level
	 * @param zoom the new zoom level for the map
	 */
	private setZoom(zoom: number) {
		if (this.map && null !== zoom) {
			this.map.setZoom(zoom, this.zoomOptions);
		}
	}

	/**
	 * Set the center of the map
	 * @param center the center point
	 */
	private setCenter(center: LatLng) {
		if (this.map && null !== center) {
			this.map.panTo(center, this.panOptions);
		}
	}

	/**
	 * Fit the map to the bounds
	 * @param center the center point
	 */
	private setFitBounds(latLngBounds: LatLngBounds) {
		if (this.map && null !== latLngBounds) {
			this.map.fitBounds(latLngBounds, this.fitBoundsOptions);
		}
	}
}
