import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	NgZone,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';
import { SPACE, DELETE, BACKSPACE } from '@angular/cdk/keycodes';
import { debounce, throttle } from 'lodash-es';
import { Actions, ofType } from '@ngrx/effects';
import { Store, Action, select } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject, Subscription } from 'rxjs';
import { pluck, takeUntil, auditTime, pairwise, distinctUntilChanged } from 'rxjs/operators';
import { ControllerStack, SelectionReport, SelectionController } from '@sixriver/map-controller';
import { control, Control, Map as LeafletMap, CRS, ZoomPanOptions, PolylineOptions } from 'leaflet';
import 'leaflet-mouse-position';

import { MapCoreError } from '../interfaces/map-core-error';
import { MapStackActionTypes } from '../map-stack/map-stack.actions';
import { LegendControl } from '../class/controls/LegendControl';
import { ZoomControl } from '../class/controls/ZoomControl';
import { EditPalette } from '../class/controls/EditPalette';
import { OccupancyGridControl } from '../class/controls/OccupancyGridControl';
import { MapStack } from '../class/mapstack/MapStack';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';
import { MapEvents } from '../interfaces/events';
import { MapStackStateService } from '../services/map-stack-state.service';
import { SelectionService } from '../services/selection.service';
import { MapCoreState } from '../reducers';
import { DetailState } from '../detail/detail.reducer';
import { DisplayOptions, DisplayOptionsMap } from '../interfaces/map-display-options';
import { DetailOpen, DetailUpdate } from '../detail/detail.actions';
import { SetMapStack } from '../map-stack/map-stack.actions';
import { createHtmlImageElement, difference } from '../utils';
import { attachToLeaflet } from '../directives/attach-to-leaflet';
import { Layer, LayerType } from '../interfaces/layer';
import { MfpsRenderer } from '../mfps/mfps.renderer';
import { MoveController } from '../class/controllers/move-controller';
import { Aisle } from '../class/mapstack/Aisle';
import { MfpState } from '../mfps/mfps.reducer';
import { DisplayOptionsService } from '../services/display-options.service';
import { MapStackState } from '../map-stack/map-stack.reducer';
import { SimulatedObject } from '../class/mapstack/SimulatedObject';
import { SimulatedObjectService, SimulatedObjectClass } from '../services/simulated-object.service';

@Component({
	selector: 'site-map',
	templateUrl: './site-map.component.html',
	styleUrls: ['./site-map.component.scss'],
})
export class SiteMapComponent implements OnDestroy, OnInit {
	@Output() mapEvent: EventEmitter<MapEvents> = new EventEmitter();

	private ngUnsubscribe = new Subject();
	public mfps$: Observable<MfpState>;
	public validation$: Subscription;

	layerGroups = {
		baseLayers: {},
		overlays: {},
	};

	/**
	 * The control that lets you select which layers you are viewing
	 */
	options: DisplayOptionsMap;
	layerControl: Control.Layers;
	zoomControl: ZoomControl;
	editPalette: EditPalette;
	leafletOptions: any;
	selectedLayer: any;
	map: LeafletMap;
	mfpsRenderer: MfpsRenderer;
	simulatedObjects: Map<string, SimulatedObject>;
	mapStack: MapStack;
	toolStack: ControllerStack;
	detailOpen = false;
	loadingMessage: string;

	occupancyGrid: HTMLImageElement;

	constructor(
		private log: NGXLogger,
		private zone: NgZone,
		private mapStackStateService: MapStackStateService,
		private displayOptionsService: DisplayOptionsService,
		private selectionService: SelectionService,
		private simulatedObjectService: SimulatedObjectService,
		private store: Store<MapCoreState>,
		private updates$: Actions,
	) {
		this.leafletOptions = {
			attributionControl: false,
			editable: true,
			crs: CRS.Simple,
			zoomAnimationThreshold: 1000,
			zoomControl: false, // the zoom controls come from ZoomControl
			doubleClickZoom: false,
			minZoom: 1,
			maxZoom: 10,
			center: [0, 0],
			zoom: 0,
		};
		this.options = new Map() as DisplayOptionsMap;
		this.showDetail = debounce(this.showDetail.bind(this), 250);
		this.onLayerPositionChange = throttle(this.onLayerPositionChange, 500);

		this.simulatedObjects = new Map<string, SimulatedObject>();
	}

	ngOnInit() {
		this.displayOptionsService
			.getOptions$()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(options => {
				this.options = options;
			});
		this.store
			.pipe(takeUntil(this.ngUnsubscribe), select('detail'))
			.subscribe((state: DetailState) => {
				this.detailOpen = state.isOpen;
				setTimeout(() => {
					// the map element's size has not settled until the animation ends.
					// only then we can map.invalidateSize.
					// The animation duration is equal too $swift-ease-out-duration * 1000
					if (this.mapStack) {
						this.updateMinZoom();
					}
				}, 400); // whenever the animation duration changes, also change the constant
			});

		if (!this.mapStack) {
			this.loadingMessage = 'Loading Map';
		}

		this.simulatedObjectService.currentMessage.subscribe((message) => this.processSimulatedObjects(message))

		this.doResize();
		this.doResize = debounce(this.doResize.bind(this), 200);
	}

	processSimulatedObjects(obstList: SimulatedObjectClass[]): void {
		obstList.forEach((obs) => {
			if (!this.simulatedObjects.has(obs.id)) {
				const layer = new SimulatedObject(obs.pose,
					{ mapEmitter: this.mapEvent, externallyCreated: true } as PolylineOptions, obs.id, obs.id);
				this.map.addLayer(layer);
				this.addNewObject(layer);
			};
		});

		const simObj = this.simulatedObjects;
		this.simulatedObjects.forEach(function (layer) {
			if (!obstList.find((obs) => obs.id === layer.id)) {
				simObj.delete(layer.id);
				layer.remove();
			}
		});
	}

	addLayer(option: DisplayOptions, layer: any) {
		if (this.options.get(option)) {
			layer.addTo(this.map);
			this.layerGroups.overlays[option] = layer;
		}
	}

	onLayerDragEnd(event: Event) {
		this.onLayerPositionChange();

		const layers = Array.from(this.selectionService.selected)
			.map(layerId => this.findLayer(layerId))
			.filter(layer => layer && this.displayOptionsService.canMove(layer.type));

		this.mapStackStateService.edit(layers as any);
	}

	onLayerPositionChange() {
		const layers = Array.from(this.selectionService.selected)
			.map(layerId => this.findLayer(layerId))
			.filter(layer => layer && this.displayOptionsService.canInspect(layer.type));
		this.store.dispatch(new DetailUpdate(layers));
	}

	addClickHandler(layer: any) {
		layer.on('mousedown', (event: any) => {
			// If there was a previously selected layer and it is editable, disable editing on it
			if (this.selectedLayer) {
				// Remove position change handlers
				if (this.selectedLayer instanceof WorkflowPoint) {
					(this.selectedLayer as any).off('drag', this.onLayerPositionChange, this);
				} else {
					this.selectedLayer.disableEdit();
					this.selectedLayer.off('dragend', this.onLayerDragEnd, this);
				}
			}

			if (event.sourceTarget) {
				this.selectedLayer = event.sourceTarget;
				if (
					this.displayOptionsService.canEdit(this.selectedLayer.type) &&
					this.displayOptionsService.canMove(this.selectedLayer.type)
				) {
					// Dispatch action every time user changes layer position
					if (this.selectedLayer instanceof WorkflowPoint) {
						// Subscribe to high-granularity updates for workflow points
						(this.selectedLayer as any).on('drag', this.onLayerPositionChange, this);
					} else {
						// For all other feature types, only update when the user finishes
						// dragging to reduce the data rate
						event.sourceTarget.enableEdit();
						this.selectedLayer.on('dragend', this.onLayerDragEnd, this);
					}
				}
			}
		});
	}

	findLayer(id: string): Layer {
		let layer: Layer = this.mapStack.findLayer(id);
		if (!layer && this.mfpsRenderer) {
			layer = this.mfpsRenderer.findMfp(id);
		}
		if (!layer) {
			layer = this.simulatedObjects.get(id);
		}
		return layer;
	}

	validationChanged(newState: string[], oldState: string[]) {
		const invalidLayers = difference(new Set(newState), new Set(oldState));
		const validLayers = difference(new Set(oldState), new Set(newState));
		validLayers.forEach(layerId => {
			const layer = this.findLayer(layerId);
			if (layer) {
				layer.classNameUpdater.removeClass('error');
			}
		});

		invalidLayers.forEach(layerId => {
			const layer = this.findLayer(layerId);
			if (layer) {
				layer.classNameUpdater.addClass('error');
			}
		});
	}

	selectionChanged(report: SelectionReport) {
		// When mode is Live View and the layer is not an MFP, suppress behavior
		report.deltaSelected.forEach(id => {
			const layer = this.findLayer(id);
			if (layer && this.displayOptionsService.canSelect(layer.type)) {
				layer.classNameUpdater.addClass('selected');
			}
		});
		report.deltaDeselected.forEach(id => {
			const layer = this.findLayer(id);
			if (layer && this.displayOptionsService.canSelect(layer.type)) {
				layer.classNameUpdater.removeClass('selected');
			}
		});
		if (report.selected.size) {
			const layers = Array.from(report.selected)
				.map(layerId => this.findLayer(layerId))
				.filter(layer => layer && this.displayOptionsService.canInspect(layer.type));
			this.showDetail(layers);
		}
		if (this.mfpsRenderer) {
			this.mfpsRenderer.setFocus(report.primary);
		}
	}

	showDetail(layers: Layer[]) {
		if (layers.length) {
			// we take the toolstack outside of the angular zone to improve performance.
			// but when the selection changes, we need to open the detail and allow angular to populate
			// the forms with all the up to date data.
			this.zone.run(() => {
				this.store.dispatch(new DetailOpen(layers));
			});
		}
	}

	addNewObject(layer: any) {
		// If layer is invalid. remove it.
		if (!(layer instanceof WorkflowPoint)) {
			// Areas are not valid if they don't have any bounds.
			if (
				layer.getBounds().getNorthEast().lat === layer.getBounds().getSouthWest().lat &&
				layer.getBounds().getNorthEast().lng === layer.getBounds().getSouthWest().lng
			) {
				this.map.removeLayer(layer);
				return;
			}
		}

		this.addClickHandler(layer);
		layer.disableEdit();

		if (layer instanceof SimulatedObject) {
			this.simulatedObjects.set(layer.id, layer);
			layer.afterAdd();
		} else if (this.mapStack) {
			// Add object to the correct map stack.
			this.mapStack.addLayer(layer);
		}
	}

	async onMapKeyEvent(event: KeyboardEvent) {
		if (event.keyCode === SPACE) {
			this.fitToView(true);
		} else if (event.keyCode === DELETE || event.keyCode === BACKSPACE) {
			this.selectionService.selected.forEach(id => {
				let layer = this.mapStack.findLayer(id);
				if (!layer) {
					layer = this.simulatedObjects.get(id);
					if (layer) {
						this.simulatedObjects.delete(layer.id);
						layer.remove();
					}
				} else if (this.displayOptionsService.canEdit(layer.type)) {
					this.mapStackStateService.remove(layer);
				}
			});
		}
	}

	addZoomControl(map: L.Map) {
		this.zoomControl = new ZoomControl();
		this.zoomControl.addTo(map);
	}

	addEditControls(map: L.Map, editOptions: string) {
		this.editPalette = new EditPalette(this.mapEvent, editOptions);
		this.editPalette.addTo(map);
	}

	addMfpStateLegend(map: L.Map) {
		const mfpStateLegend = new LegendControl('bottomleft');
		mfpStateLegend.addTo(map);
	}

	addOccupancyGridControl(map: L.Map) {
		const occupancyGridControl = new OccupancyGridControl('topleft');
		occupancyGridControl.addTo(map);
	}

	async onMapReady(map: L.Map) {
		this.map = map;
		// Add the coordinate of the mouse to a corner of the map
		if (this.options.get(DisplayOptions.Position)) {
			(control as any)
				.mousePosition({
					numDigits: 3,
					lngFirst: true,
					position: 'bottomright',
					separator: ', ',
					emptyString: '',
				})
				.addTo(map);
		}

		// Create all the panes in the right zIndex so that some items correctly appear on top of others.
		(this.map as any).createPane('aislePane').style.zIndex = 490;
		(this.map as any).createPane('mfpPane').style.zIndex = 610;
		(this.map as any).createPane('mfpLabelsPane').style.zIndex = 611;

		(this.map as any).editTools.on('editable:drawing:commit', (event: any) =>
			this.addNewObject(event.layer),
		);

		this.addZoomControl(this.map);

		const editPalette = this.options.get(DisplayOptions.EditPalette);
		if (editPalette) {
			if (editPalette === "editor") {
				this.addOccupancyGridControl(this.map);
			}
			this.addEditControls(this.map, editPalette as string);
		}

		if (this.options.get(DisplayOptions.MfpStateLegend)) {
			this.addMfpStateLegend(this.map);
		}
		this.mapStackStateService.mapStack$
			.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
			.subscribe((mapStack: MapStack) => {
				if (this.mapStack) {
					this.clearLeafletMapStack();
				}
				this.mapStack = mapStack;
				this.buildLeafletMapStack();
				this.loadingMessage = null;
				this.installControllers();
			});

		this.updates$
			.pipe(
				ofType(MapStackActionTypes.FetchLocalError, MapStackActionTypes.FetchError),
				pluck('payload'),
				takeUntil(this.ngUnsubscribe),
			)
			.subscribe(async (error: MapCoreError) => {
				this.loadingMessage = error.message;
			});
	}

	private installControllers() {
		this.toolStack = new ControllerStack(this.map.getContainer());
		attachToLeaflet(this.toolStack, this.map, this.options, this.zone);
		// dispatches an action to the store
		this.toolStack.dispatch = (action: Action) => {
			this.store.dispatch(action);
		};
		this.toolStack.addController(new MoveController(this.selectionService, this.map));
		this.toolStack.addController(new SelectionController(this.selectionService));

		this.map.dragging.enable();

		// map.touchZoom.disable();
		this.map.doubleClickZoom.disable();
		// map.scrollWheelZoom.disable();
		this.map.boxZoom.disable();
		// map.keyboard.disable();
		if (this.map.tap) this.map.tap.disable();
		this.map.getContainer().style.cursor = 'default';
	}

	private clearLeafletMapStack() {
		this.map.removeLayer(this.mapStack.occupancyGridGroup);
		this.map.removeLayer(this.mapStack.aisles);
		this.map.removeLayer(this.mapStack.workflowPoints);
		this.mapStack.areas.forEach((value: L.FeatureGroup<any>) => {
			this.map.removeLayer(value);
		});
		if (this.layerControl) {
			(this.layerControl as any).remove();
			this.layerGroups.overlays = {};
		}
		if (this.mfpsRenderer) {
			this.mfpsRenderer.onDestroy();
		}
	}

	private buildLeafletMapStack() {
		this.mapStack.occupancyGridGroup.addLayer(this.mapStack.occupancyGrid);
		this.addLayer(DisplayOptions.OccupancyGrid, this.mapStack.occupancyGridGroup);
		this.addLayer(DisplayOptions.Aisle, this.mapStack.aisles);
		this.addLayer(DisplayOptions.WorkflowPoint, this.mapStack.workflowPoints);
		this.mapStack.areas.forEach((value: any, key: string) => {
			this.addLayer(key as DisplayOptions, value);
			this.addClickHandler(value);
		});
		this.mapStack.aisles.eachLayer((aisle: Aisle) => this.addClickHandler(aisle));
		this.mapStack.workflowPoints.eachLayer((workflowPoint: WorkflowPoint) =>
			this.addClickHandler(workflowPoint),
		);

		this.updateMinZoom();
		this.fitToView(false);

		Object.assign(this.map.options, this.options);
		if (this.options.get(DisplayOptions.LayerControl)) {
			this.layerControl = control.layers(this.layerGroups.baseLayers, this.layerGroups.overlays);
			this.layerControl.addTo(this.map);
		}

		if (this.options.get(DisplayOptions.MfpDisplay)) {
			this.mfps$ = this.store.pipe(auditTime(500), select('mfps'));
			this.mfpsRenderer = new MfpsRenderer(
				this.map,
				this.mfps$.pipe(select('mfps')),
				this.mfps$.pipe(select('filter')),
				this.selectionService.primary,
				this.options.get(DisplayOptions.StaleMfpExpiration) as number | undefined,
				(this.options.get(DisplayOptions.DwellMfpDuration) as number | undefined) || -1,
				this.displayOptionsService.canMove(DisplayOptions.MfpDisplay) ? this.mapEvent : undefined,
				this.zone,
				this.log,
			);
		}

		if (this.validation$) {
			this.validation$.unsubscribe();
		}
		this.validation$ = this.store
			.pipe(select('mapStack'), pluck<MapStackState, string[]>('validation'), pairwise())
			.subscribe(([oldState, newState]) => this.validationChanged(newState, oldState));

		this.selectionService.observe(this.selectionChanged.bind(this));
	}

	onOccupancyGridSelect(event: any) {
		const occupancyGridBlob = event.target.files[0];
		const imageObjectUrl = URL.createObjectURL(occupancyGridBlob);
		this.changeOccupancyGrid(imageObjectUrl, occupancyGridBlob);
	}

	async changeOccupancyGrid(imageObjectUrl: string, imageBlob: Blob) {
		const occupancyGridImage = await createHtmlImageElement(imageObjectUrl);

		this.map.removeLayer(this.mapStack.occupancyGrid);
		this.addLayer(
			DisplayOptions.OccupancyGrid,
			this.mapStack.changeOccupancyGrid(occupancyGridImage, imageBlob),
		);

		this.updateMinZoom();
		this.fitToView(true);
	}

	public fitToView(animate: boolean = false) {
		const bounds = this.mapStack.getBounds();
		this.map.fitBounds(bounds, { animate });
	}

	/**
	 * Keep the min zoom the size of the map stack's bounds
	 */
	public updateMinZoom() {
		this.map.invalidateSize({ animate: false, pan: false } as ZoomPanOptions);
		this.map.options.minZoom = 1;
		const bounds: L.LatLngBounds = this.mapStack.getBounds();
		this.map.options.maxBounds = bounds.pad(1);
		this.map.options.minZoom = this.map.getBoundsZoom(bounds);
		this.map.options.maxZoom =
			(this.options.get(DisplayOptions.MaxZoom) as number | undefined) || 10;
		this.zoomControl.setHomeBounds(bounds);
	}

	@HostListener('window:resize', [])
	onResize() {
		this.doResize();
	}

	/**
	 * Resize the map to fit it's parent container
	 */
	private doResize() {
		// Invalidate the map size to trigger it to update itself
		this.zone.runOutsideAngular(() => {
			if (this.mapStack) {
				this.updateMinZoom();
			}
		});
	}

	onSave() {
		this.mapStackStateService.saveMap();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();

		if (this.mfpsRenderer) {
			this.mfpsRenderer.onDestroy();
		}
		this.store.dispatch(new SetMapStack(null));
	}
}
