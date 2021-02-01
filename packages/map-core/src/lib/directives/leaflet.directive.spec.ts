import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Chance } from 'chance';
import { LatLng, LatLngBounds, Map } from 'leaflet';
import { omit } from 'lodash-es';
import { FaultState, FaultResolution } from '@sixriver/mfp_lib_js/browser';

import { SiteMapComponent } from '../site-map/site-map.component';
import { TestModule } from '../test.module';
import { LeafletDirective } from '../directives/leaflet.directive';
import { MapStackEditorDirective } from '../directives/map-stack-editor.directive';
import { SelectionService } from '../services/selection.service';
import { Aisle } from '../class/mapstack/Aisle';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';
import { KeepOutArea } from '../class/mapstack/KeepOutArea';
import { CostArea } from '../class/mapstack/CostArea';
import { QueueArea } from '../class/mapstack/QueueArea';
import { StayOnPathArea } from '../class/mapstack/StayOnPathArea';
import { SpeedLimitArea } from '../class/mapstack/SpeedLimitArea';
import { WeightedArea, WeightCosts } from '../class/mapstack/WeightedArea';
import { ImpassableArea } from '../class/mapstack/ImpassableArea';
import { OccupancyGrid } from '../class/mapstack/OccupancyGrid';
import { MfpDisplay } from '../class/mapstack/MfpDisplay';
import { Pose } from '../interfaces/pose';
import { LayerType, Layer } from '../interfaces/layer';
import { Mfp, MotionState } from '../interfaces/mfp';
import { editorOptions } from '../interfaces/map-display-options';
import { clone } from '../class/mapstack/clone';
import { DisplayOptionsService } from '../services/display-options.service';
import { SimulatedObjectService } from '../services/simulated-object.service';

const mockMfp = new Mfp({
	fieldUpdated: { pose: 1 },
	faults: {
		[FaultState.BATTERY_COMMUNICATION_FAILURE]: {
			id: 'a8e2117a-148c-41e6-b052-40562fdd6abe',
			code: FaultState.BATTERY_COMMUNICATION_FAILURE,
			resolution: FaultResolution.CONTACT_SUPPORT,
			timestamp: new Date(),
		},
	},
	aisleMask: null,
	availableWorkspaces: null,
	batteryLevel: null,
	currentPose: null,
	id: 'mfp-debug',
	jobSlotAssignments: [],
	motionState: MotionState.IDLE,
	name: 'mfp-debug',
	phase: null,
	pose: { x: 3.009143114089966, y: 5, orientation: 0 },
	state: null,
	takeoffDestination: null,
	taskBatches: [],
	updated: new Date('2019-07-11T17:00:49.608Z'),
	userId: null,
	workspaceReservations: null,
	workspaces: null,
});

describe('LeafletDirective', () => {
	let component: SiteMapComponent;
	let fixture: ComponentFixture<SiteMapComponent>;
	const chance = new Chance();
	let latLng: LatLng;
	let latLngBounds: LatLngBounds;
	let map: Map;

	beforeEach(async(() => {
		latLng = new LatLng(chance.integer(), chance.integer());
		latLngBounds = new LatLngBounds(latLng, latLng);

		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [DisplayOptionsService, SelectionService, SimulatedObjectService],
			declarations: [LeafletDirective, MapStackEditorDirective, SiteMapComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		const displayOptionsService = TestBed.get(DisplayOptionsService);
		displayOptionsService.selectPreset('editorOptions');
		fixture = TestBed.createComponent(SiteMapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		map = component.map;
	});

	it('should create Layers', () => {
		expect(component).toBeTruthy();
		expect(map).toBeTruthy();

		let layer: any;
		layer = new Aisle([latLng, latLng]);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, 'foo');
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new KeepOutArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new CostArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new QueueArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new StayOnPathArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new SpeedLimitArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new WeightedArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new ImpassableArea(latLngBounds);
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new OccupancyGrid(LayerType.OccupancyGrid, latLngBounds, 'http://');
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
		layer = new MfpDisplay(new Mfp({ pose: { orientation: 0, x: 0, y: 0 } }), -1, {});
		map.addLayer(layer);
		expect(map.hasLayer(layer)).toBeTruthy();
	});

	it('should create an svg marker for the Aisles', () => {
		let result = document.querySelector('#stack-aisle-arrow');
		expect(result).toBeNull();

		const layer = new Aisle([latLng, latLng]);
		map.addLayer(layer);

		result = document.querySelector('#stack-aisle-arrow');
		expect(result).toBeTruthy();
	});

	it('should apply a marker on a new Aisle by default', () => {
		const layer = new Aisle([latLng, latLng]);
		map.addLayer(layer);

		const element: HTMLElement = (layer as any).getElement();
		expect(element.hasAttribute('marker-end')).toBeTruthy();

		layer.directed = false;
		layer.refresh();

		expect(element.hasAttribute('marker-end')).toBeFalsy();
	});

	it('should update the color of the WeightedArea based on the direction', () => {
		const cardinals = ['north', 'south', 'east', 'west'];
		cardinals.forEach(cd => {
			const cost = new WeightCosts();
			cost[cd] = 100;
			const layer = new WeightedArea(latLngBounds, {}, undefined, undefined, cost);
			map.addLayer(layer);

			const element: HTMLElement = (layer as any).getElement();
			expect(element.classList.contains('stack-weighted-' + cd)).toBeTruthy();
		});
	});

	it('should update the color of the Mfp based on the MotionState', () => {
		const testStates = {
			charging: MotionState.CHARGING,
			docking: MotionState.DOCKING,
			idle: MotionState.IDLE,
			traveling: MotionState.TRAVELING,
			paused: MotionState.PAUSED,
		};
		Object.keys(testStates).forEach(state => {
			const mfp = new Mfp({ motionState: testStates[state], pose: { orientation: 0, x: 0, y: 0 } });
			const layer = new MfpDisplay(mfp, -1, {});
			map.addLayer(layer);

			const element: HTMLElement = (layer as any).getElement();
			expect(element.classList.contains(state)).toBeTruthy();
		});
	});

	it('should clone Layers', () => {
		const cloneAndCompare = (layer: Layer) => {
			const layerClone = clone(layer);
			expect(JSON.stringify(omit(layer, 'options'))).toEqual(
				JSON.stringify(omit(layerClone, 'options')),
			);
		};
		cloneAndCompare(new Aisle([latLng, latLng], {}, 'test1', 'id1'));
		cloneAndCompare(new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, 'foo'));
		cloneAndCompare(new KeepOutArea(latLngBounds, {}, 'test1', 'id1'));
		cloneAndCompare(new CostArea(latLngBounds, {}, 'test1', 'id1'));
		cloneAndCompare(new QueueArea(latLngBounds, {}, 'queueName', 'test1', 'id1'));
		cloneAndCompare(new StayOnPathArea(latLngBounds, {}, 'test1', 'id1'));
		cloneAndCompare(new SpeedLimitArea(latLngBounds, {}, 'test1', 'id1'));
		cloneAndCompare(new WeightedArea(latLngBounds, {}, 'test1', 'id1', new WeightCosts()));
		cloneAndCompare(new ImpassableArea(latLngBounds, {}, 'test1', 'id1'));
		cloneAndCompare(new MfpDisplay(new Mfp({ pose: { orientation: 0, x: 0, y: 0 } }), -1, {}));
	});

	it('should create an MFP with badges and a name label', () => {
		const layer = new MfpDisplay(mockMfp, -1, {});
		map.addLayer(layer);
		layer.setState(mockMfp, true);

		const element: HTMLElement = (layer as any).getElement();
		expect(element.classList.contains('mfp-display')).toBeTruthy();

		map.removeLayer(layer);
	});
});
