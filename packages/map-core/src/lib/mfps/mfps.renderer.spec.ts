import { EventEmitter, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { map, LatLng } from 'leaflet';
import { DeviceClass, FaultState, Fault, FaultResolution } from '@sixriver/mfp_lib_js/browser';

import { TestModule } from '../test.module';
import { MapEvents } from '../interfaces/events';
import { Mfp, MotionState, Phase } from '../interfaces/mfp';
import { MfpsRenderer, MFP_DEFAULT_OPACITY } from './mfps.renderer';
import { MfpDisplay } from '../class/mapstack/MfpDisplay';
import { Filter } from './mfps.reducer';

const mockMfp = new Mfp({
	fieldUpdated: { pose: new Date().getTime() },
	aisleMask: null,
	batteryLevel: null,
	currentPose: null,
	id: 'mfp-debug',
	jobSlotAssignments: [],
	motionState: MotionState.IDLE,
	name: 'mfp-debug',
	phase: Phase.PREPICK,
	pose: { x: 3.009143114089966, y: 5, orientation: 0 },
	state: null,
	takeoffDestination: null,
	taskBatches: [],
	updated: new Date(),
	userId: null,
	workspaceReservations: null,
	workspaces: null,
});

const mockFault: Fault = {
	code: FaultState.NAVIGATION_LOST,
	resolution: FaultResolution.LOCALIZE,
	id: 'af664883ff123',
	timestamp: new Date(),
};

describe('MfpsRenderer', () => {
	let fixture: HTMLElement;
	let mfpsRenderer;
	let testMap;
	let mfps: BehaviorSubject<Map<string, Mfp>>;
	const filter: BehaviorSubject<Filter> = new BehaviorSubject<Filter>(null);

	const mapEventEmitter = new EventEmitter<MapEvents>();

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [NGXLogger],
		});

		fixture = document.createElement('div');
		fixture.style.width = '100px';
		fixture.style.height = '100px';
		document.body.appendChild(fixture);
		testMap = map(fixture, {});
		testMap.panTo(new LatLng(40.737, -73.923));
		testMap.createPane('mfpPane').style.zIndex = 610;
		testMap.createPane('mfpLabelsPane').style.zIndex = 611;

		mfps = new BehaviorSubject<Map<string, Mfp>>(new Map());

		mfpsRenderer = new MfpsRenderer(
			testMap,
			mfps,
			filter,
			'mfp-debug',
			undefined,
			1800,
			mapEventEmitter,
			TestBed.get(NgZone),
			TestBed.get(NGXLogger),
		);
	});

	afterEach(() => {
		mfpsRenderer.onDestroy();
		fixture.remove();
	});

	it('should create', () => {
		expect(mfpsRenderer).toBeTruthy();
	});

	it('should create some mfps', () => {
		mfps.next(new Map([[mockMfp.id, mockMfp]]));
		expect(mfpsRenderer.findMfp('mfp-debug')).toBeTruthy();
		mfps.next(new Map([[mockMfp.id, new Mfp({ ...mockMfp, userId: 'quinn' })]]));

		mfpsRenderer.pruneUnresponsiveMfps();

		expect(mfpsRenderer.findMfp('mfp-debug')).toBeUndefined();
	});

	it('should not render non chucks', () => {
		mfps.next(
			new Map([
				[
					'mfp-packout',
					new Mfp({
						...mockMfp,
						deviceClass: DeviceClass.PACKOUT,
						id: 'mfp-packout',
					}),
				],
			]),
		);
		expect(mfpsRenderer.findMfp('mfp-packout')).toBeFalsy();
		mfps.next(
			new Map([
				[
					'mfp-kiosk',
					new Mfp({
						...mockMfp,
						deviceClass: DeviceClass.SORTATION_KIOSK,
						id: 'mfp-kiosk',
					}),
				],
			]),
		);
		expect(mfpsRenderer.findMfp('mfp-sortation')).toBeFalsy();
	});

	it('should not render lost chucks', () => {
		mfps.next(new Map([['mfp-debug', mockMfp]]));
		expect(mfpsRenderer.findMfp('mfp-debug')).toBeTruthy();
		mfps.next(
			new Map([
				[
					'mfp-debug',
					new Mfp({
						...mockMfp,
						faults: { [FaultState.NAVIGATION_LOST]: mockFault },
					}),
				],
			]),
		);
		expect(mfpsRenderer.findMfp('mfp-debug')).toBeFalsy();
	});

	it('should focus on an MFP', () => {
		mfps.next(new Map([['mfp-debug', mockMfp]]));
		mfps.next(new Map([['mfp-debug2', new Mfp({ ...mockMfp, id: 'mfp-debug2' })]]));
		mfpsRenderer.setFocus('mfp-debug');
		expect((mfpsRenderer as any).trackingMfp).toEqual('mfp-debug');
		mfpsRenderer.setFocus('mfp-debug2');
		expect((mfpsRenderer as any).trackingMfp).toEqual('mfp-debug2');
	});

	it('should update the mfp when state changes', () => {
		mfps.next(new Map([['mfp-debug', mockMfp]]));
		mfpsRenderer.setFocus('mfp-debug');

		const mfpDisplay = mfpsRenderer.findMfp('mfp-debug');

		spyOn(mfpDisplay, 'setState').and.callFake(() => {});
		MfpDisplay.getRenderingFields().forEach(field => {
			mfps.next(new Map([['mfp-debug', new Mfp({ ...mockMfp, [field]: 'a-value' })]]));
		});
		expect(mfpDisplay.setState).toHaveBeenCalledTimes(MfpDisplay.getRenderingFields().length);
	});

	it('it should render a picker when picking', () => {
		mfps.next(new Map([['mfp-debug', mockMfp]]));
		const mfpDisplay = mfpsRenderer.findMfp('mfp-debug');
		let items = mfpDisplay.getElement().querySelectorAll('svg>circle');
		expect(items.length).toEqual(0);
		mfps.next(new Map([['mfp-debug', new Mfp({ ...mockMfp, phase: Phase.PICKING })]]));
		items = mfpDisplay.getElement().querySelectorAll('svg>circle');
		expect(items.length).toEqual(1);
		mfps.next(new Map([['mfp-debug', new Mfp({ ...mockMfp, phase: Phase.PACKOUT })]]));
		items = mfpDisplay.getElement().querySelectorAll('svg>circle');
		expect(items.length).toEqual(0);
	});

	it('it should filter out chucks', () => {
		mfps.next(
			new Map([
				['mfp-debug', mockMfp],
				['mfp-filtered', new Mfp({ ...mockMfp, id: 'mfp-filtered' })],
			]),
		);
		const getOpacity = id => {
			return mfpsRenderer
				.findMfp(id)
				.getElement()
				.querySelector('svg')
				.getAttribute('opacity');
		};
		expect(mfpsRenderer.findMfp('mfp-debug')).toBeTruthy();
		expect(getOpacity('mfp-debug')).toEqual(MFP_DEFAULT_OPACITY.toString());
		filter.next({ ids: ['mfp-debug'], name: 'filter', color: 'blue' });
		expect(getOpacity('mfp-filtered')).toEqual('0.2375');
		expect(getOpacity('mfp-debug')).toEqual(MFP_DEFAULT_OPACITY.toString());
		filter.next(null);
		expect(getOpacity('mfp-filtered')).toEqual(MFP_DEFAULT_OPACITY.toString());
	});
});
