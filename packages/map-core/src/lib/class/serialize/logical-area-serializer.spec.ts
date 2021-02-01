import { Chance } from 'chance';
import { LatLng, LatLngBounds } from 'leaflet';
import { LogicalAreaSerializer } from '@sixriver/map-io';

import { CostArea } from '../mapstack/CostArea';
import { ImpassableArea } from '../mapstack/ImpassableArea';
import { KeepOutArea } from '../mapstack/KeepOutArea';
import { QueueArea } from '../mapstack/QueueArea';
import { SpeedLimitArea } from '../mapstack/SpeedLimitArea';
import { StayOnPathArea } from '../mapstack/StayOnPathArea';
import { WeightedArea } from '../mapstack/WeightedArea';
import { MapStackFactory } from '../mapstack/MapStackFactory';

describe('LogicalAreaSerializer', () => {
	const chance = new Chance();
	let latLng: LatLng;
	let latLngBounds: LatLngBounds;
	let validators: Function[];

	beforeEach(() => {
		spyOn(LogicalAreaSerializer, 'isValidObstacle').and.returnValue(true);
		spyOn(LogicalAreaSerializer, 'isValidCostArea').and.returnValue(true);
		spyOn(LogicalAreaSerializer, 'isValidWeightedArea').and.returnValue(true);
		spyOn(LogicalAreaSerializer, 'isValidSpeedLimit').and.returnValue(true);
		spyOn(LogicalAreaSerializer, 'isValidPlaySound').and.returnValue(true);
		validators = [
			LogicalAreaSerializer.isValidObstacle,
			LogicalAreaSerializer.isValidCostArea,
			LogicalAreaSerializer.isValidWeightedArea,
			LogicalAreaSerializer.isValidSpeedLimit,
			LogicalAreaSerializer.isValidPlaySound,
		];

		latLng = new LatLng(chance.integer(), chance.integer());
		latLngBounds = new LatLngBounds(latLng, latLng);
	});

	describe('isValid', () => {
		/**
		 * Confirm that only one function out of a list of functions ran (assumes that all functions have spies on them)
		 * @param funcs All of the functions that could have run
		 * @param func The only function that should have run
		 */
		const ranOnly = (funcs: Function[], func: Function) => {
			expect(func).toHaveBeenCalled();
			funcs.filter(f => f !== func).map(f => expect(f).not.toHaveBeenCalled());
		};

		it('should call the correct validator for impassable areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new ImpassableArea(latLngBounds));
			LogicalAreaSerializer.isValid(area);
			ranOnly(validators, LogicalAreaSerializer.isValidObstacle);
		});

		it('should call the correct validator for keepout areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new KeepOutArea(latLngBounds));
			LogicalAreaSerializer.isValid(area);
			ranOnly(validators, LogicalAreaSerializer.isValidObstacle);
		});

		it('should call the correct validator for cost areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new CostArea(latLngBounds));
			LogicalAreaSerializer.isValid(area);
			ranOnly(validators, LogicalAreaSerializer.isValidCostArea);
		});

		it('should call the correct validator for weighted areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new WeightedArea(latLngBounds));
			LogicalAreaSerializer.isValid(area);
			ranOnly(validators, LogicalAreaSerializer.isValidWeightedArea);
		});

		it('should call the correct validator for speed limit areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new SpeedLimitArea(latLngBounds));
			LogicalAreaSerializer.isValid(area);
			ranOnly(validators, LogicalAreaSerializer.isValidSpeedLimit);
		});

		it('should always return true for stay on path areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new StayOnPathArea(latLngBounds));
			const result = LogicalAreaSerializer.isValid(area);
			expect(result).toBe(true);
		});

		it('should always return true for queue areas', () => {
			const area = MapStackFactory.createFeatureFromArea(new QueueArea(latLngBounds));
			const result = LogicalAreaSerializer.isValid(area);
			expect(result).toBe(true);
		});
	});
});
