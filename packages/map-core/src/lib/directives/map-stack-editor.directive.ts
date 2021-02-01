import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import { Control } from 'leaflet';
import { Observable } from 'rxjs';

import { LeafletDirective } from './leaflet.directive';
import { LeafletDirectiveWrapper } from './leaflet.directive.wrapper';
import { MapStack } from '../class/mapstack/MapStack';
import { DisplayOptionsMap, DisplayOptions } from '../interfaces/map-display-options';
import { DisplayOptionsService } from '../services/display-options.service';

@Directive({
	selector: '[appMapStackEditor]',
})
export class MapStackEditorDirective implements OnInit, OnDestroy {
	leafletDirective: LeafletDirectiveWrapper;

	featureGroup: L.FeatureGroup<any>;

	controls: L.Control[] = [];
	hasControls: boolean = false;

	mapStack: MapStack;

	@Input('leafletDrawOptions') drawOptions: any = null;

	constructor(leafletDirective: LeafletDirective, private displayOptionsService: DisplayOptionsService) {
		this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
	}

	ngOnInit() {
		this.leafletDirective.init();

		const map: L.Map = this.leafletDirective.getMap();

		// Use the map stack object for the feature group.
		this.mapStack = this.leafletDirective.getMapStack();
		this.displayOptionsService.getOptions$().subscribe((options) => {
			if (options.get(DisplayOptions.EditPalette) && !this.hasControls) {
				this.addControls();
			} else if (!options.get(DisplayOptions.EditPalette) && this.hasControls) {
				this.removeControls();
			}
		});

		// // Register the main handler for events coming from the draw plugin
		// this.leafletDirective.getMap().on('editable:created', (e: any) => {
		// 	const layer = e.layer;
		// 	this.mapStack.addLayer(layer);
		// });
	}

	addControls() {
		const map: L.Map = this.leafletDirective.getMap();

		this.controls.forEach((control: Control) => {
			map.addControl(control);
		});
		this.hasControls = true;
	}

	removeControls() {
		const map: L.Map = this.leafletDirective.getMap();

		this.controls.forEach((control: Control) => {
			map.removeControl(control);
		});
		this.hasControls = false;
	}

	ngOnDestroy() {
		this.removeControls();
	}
}
