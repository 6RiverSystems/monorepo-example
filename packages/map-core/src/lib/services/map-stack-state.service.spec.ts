import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Chance } from 'chance';
import { validate } from '@sixriver/map-validator';

import { TestModule } from '../test.module';
import { MapStackStateService } from './map-stack-state.service';
import { MapCoreState } from '../reducers';
import { FetchMapStackComplete } from '../map-stack/map-stack.actions';
import { MapStack } from '../class/mapstack/MapStack';
import { Aisle } from '../class/mapstack/Aisle';
import { MapStackService } from '../services/map-stack.service';
import { getRandomLatLng } from '../test/lat-lng-factory';
import { MapStackSerializer } from '../class/serialize/MapStackSerializer';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';
import { Pose } from '../interfaces/pose';
import { WorkflowPointState } from '../interfaces/workflow-point-state';
import { DisplayOptionsService } from '../services/display-options.service';
import { DisplayOptions } from '../interfaces/map-display-options';
import testMap from '../../../../../tools/test-fixtures/map-stack/xpomem.json';

describe('MapStackStateService', () => {
	const chance = new Chance();
	let service: MapStackStateService;
	let store: Store<MapCoreState>;
	let mapStackService: MapStackService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MapStackStateService, DisplayOptionsService],
		});

		service = TestBed.get(MapStackStateService);
		store = TestBed.get(Store);
		mapStackService = TestBed.get(MapStackService);
		spyOn(mapStackService, 'saveMapStack');
		spyOn(mapStackService, 'saveLocalMapStack');
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getMapStack', () => {
		it('should get the map stack', async () => {
			const expectedResult = new MapStack({});
			store.dispatch(new FetchMapStackComplete(expectedResult));
			expect(await service.getMapStack()).toEqual(expectedResult);
		});
	});

	describe('edit', () => {
		it('should edit the layer', () => {
			// Create a map stack with a single aisle
			const mapStack = new MapStack({});
			const originalLatLng = [getRandomLatLng(), getRandomLatLng()];
			const aisle = new Aisle(originalLatLng);
			mapStack.addLayer(aisle);
			store.dispatch(new FetchMapStackComplete(mapStack));
			expect(aisle.getLatLngs()).toEqual(originalLatLng);

			// Create a new aisle with the same ID
			const newLatLng = [getRandomLatLng(), getRandomLatLng()];
			const editedAisle = new Aisle(newLatLng, {}, undefined, aisle.id);

			// Edit that aisle
			service.edit([editedAisle]);
			expect(aisle.getLatLngs()).toEqual(editedAisle.getLatLngs());
		});

		it('should throw an error when the layer is not in the mapstack', () => {
			store.dispatch(new FetchMapStackComplete(new MapStack({})));
			const aisle = new Aisle([getRandomLatLng(), getRandomLatLng()]);
			expect(() => service.edit([aisle])).toThrowError();
		});
	});

	describe('saveMap', () => {
		it('should throw error when attempting to save without a Map Stack', () => {
			expect(() => service.saveMap()).toThrowError();
		});
		it('should save the map stack', () => {
			const fileName = chance.string();
			const mapStack = new MapStack({});
			mapStack.baseFileName = fileName;
			store.dispatch(new FetchMapStackComplete(mapStack));

			expect(() => service.saveMap()).not.toThrowError();
			expect(mapStackService.saveMapStack).toHaveBeenCalledWith(fileName, mapStack);
		});
	});

	describe('saveLocalMap', () => {
		it('should throw error when attempting to save without a Map Stack', () => {
			expect(() => service.saveLocalMap()).toThrowError();
		});
		it('should save the map stack', () => {
			const fileName = chance.string();
			const mapStack = new MapStack({});
			mapStack.baseFileName = fileName;
			store.dispatch(new FetchMapStackComplete(mapStack));

			expect(() => service.saveLocalMap()).not.toThrowError();
			expect(mapStackService.saveLocalMapStack).toHaveBeenCalledWith(fileName, mapStack);
		});
	});

	describe('remove', () => {
		it('should remove the layer', () => {
			// Create a map stack with a single aisle
			const mapStack = new MapStack({});
			const originalLatLng = [getRandomLatLng(), getRandomLatLng()];
			const aisle = new Aisle(originalLatLng);
			mapStack.addLayer(aisle);
			store.dispatch(new FetchMapStackComplete(mapStack));
			expect(aisle.getLatLngs()).toEqual(originalLatLng);

			// Create a new aisle with the same ID
			const newLatLng = [getRandomLatLng(), getRandomLatLng()];
			const editedAisle = new Aisle(newLatLng, {}, undefined, aisle.id);

			// First remove should work. Because the aisle exists.
			expect(() => service.remove(editedAisle)).not.toThrowError();

			// Second remove will not work because the aisle has been removed previously.
			expect(() => service.remove(editedAisle)).toThrowError();
		});
	});

	describe('serialize', () => {
		it('should parse and serialize', () => {
			const serializer: MapStackSerializer = MapStackSerializer.fromJson(testMap);
			const testMapAfter = serializer.toString();
			expect(JSON.parse(testMapAfter)).toEqual(testMap);

			const mapStack = serializer.toMapStack(new Image(), new Blob());
			const serializer2 = MapStackSerializer.fromMapStack(mapStack);
			const testMapAfter2 = JSON.parse(serializer2.toString());
			expect(testMapAfter2).toEqual(testMap);

			expect(validate(testMapAfter2)).toBeTruthy();
		});
	});

	describe('updateWorkflowPointState', () => {
		beforeEach(() => {
			const displayOptionsService = TestBed.get(DisplayOptionsService);
			displayOptionsService.setOption(DisplayOptions.WorkflowStatusToggleEnabled, true);
		});

		it('should update the layers', async () => {
			// Create a map stack with a single workflow point
			const name = chance.word();
			const id = chance.guid();
			const mapStack = new MapStack({});
			const workflowPoint = new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, id);
			workflowPoint.name = name;
			mapStack.addLayer(workflowPoint);
			const layer = mapStack.findLayer(id);
			const workflowPointState = <WorkflowPointState>{
				maxReservationCount: 9,
				enabled: false,
				mapPointName: name,
			};
			spyOn(layer, 'updateEnabledState');
			spyOn(service, 'getMapStack').and.returnValue(Promise.resolve(mapStack));
			spyOn(mapStack.workflowPoints, 'getLayers').and.returnValue([layer]);
			await service.updateWorkflowPointState(workflowPointState);
			expect(service.getMapStack).toHaveBeenCalled();
			expect(mapStack.workflowPoints.getLayers).toHaveBeenCalled();
			expect(layer.updateEnabledState).toHaveBeenCalled();
		});
	});
});
