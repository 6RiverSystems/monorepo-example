import { assert } from 'chai';
import { omit, cloneDeep } from 'lodash-es';
import { MapStack } from '@sixriver/map-io';

import { validate } from './validate';
import xpomem from '../../../../tools/test-fixtures/map-stack/xpomem.json';
import empty from '../../../../tools/test-fixtures/map-stack/empty.json';
import map from '../../../../tools/test-fixtures/map-stack/map.json';
import simple from '../../../../tools/test-fixtures/map-stack/simple.json';
import staging271 from '../../../../tools/test-fixtures/map-stack/staging271.json';

describe('Validator', () => {
	[xpomem, empty, map, simple, staging271].map(map => {
		it(`validates map-stack: ${map.name}`, () => {
			const errors = [];
			const isValid = validate(map as MapStack, errors);
			assert.isOk(
				isValid,
				`failed to validate map: ${map.name} \nValidations errors:\n ${errors
					.map(e => e.message + '\n')
					.join('')}`,
			);
		});
	});

	it('fails validation when missing top level properties', () => {
		Object.keys(empty).forEach(key => {
			const map = omit(empty, [key]) as MapStack;
			const error = [];
			const isValid = validate(map, error);
			assert.isNotOk(isValid);
			assert.deepEqual(error[0].message, `should have required property '${key}'`);
		});
	});

	it('shows multiple validation errors when missing top level properties', () => {
		const errors = [];
		const isValid = validate({} as MapStack, errors);
		assert.isNotOk(isValid);
		assert.equal(errors.length, 10);
	});

	it('finds badly formed polygons', () => {
		const error = [];
		const mapStackClone = cloneDeep(simple) as MapStack;
		// tiny polygon
		mapStackClone.logical.features[0].geometry.coordinates = [
			[
				[64.05, 115.521],
				[64.05, 115.52],
				[64.051, 115.52],
				[64.051, 115.521],
				[64.05, 115.521],
			],
		];
		const isValid = validate(mapStackClone, error);
		assert.equal(error.length, 2);
		assert.isNotOk(isValid);
		// polygon that does not close
		mapStackClone.logical.features[0].geometry.coordinates[0][4] = [0, 0];
		assert.equal(error.length, 2);
		assert.isNotOk(isValid);
		// polygon with no width
		mapStackClone.logical.features[0].geometry.coordinates = [
			[
				[64.05, 115.52],
				[64.05, 115.52],
				[72.9, 115.52],
				[72.9, 115.52],
				[64.05, 115.52],
			],
		];
		assert.equal(error.length, 2);
		assert.isNotOk(isValid);
		// polygon with no height
		mapStackClone.logical.features[0].geometry.coordinates = [
			[
				[72.9, 110.52],
				[72.9, 115.52],
				[72.9, 115.52],
				[72.9, 110.52],
				[72.9, 110.52],
			],
		];
		assert.equal(error.length, 2);
		assert.isNotOk(isValid);
		// polygon with out enough vertices
		mapStackClone.logical.features[0].geometry.coordinates = [
			[
				[64.05, 110.52],
				[64.05, 115.52],
				[72.9, 115.52],
			],
		];
		assert.equal(error.length, 2);
		assert.isNotOk(isValid);
	});

	it('validates name uniqueness for aisles and workflow points queue area, stayOnPath area, speedLimit area', () => {
		const testDuplicate = (customOp: (object) => void) => {
			const error = [];
			const mapStackClone = cloneDeep(simple) as MapStack;
			customOp(mapStackClone);
			const isValid = validate(mapStackClone, error);
			assert.equal(error.length, 2);
			assert.isNotOk(isValid);
		};
		testDuplicate(mapStack => {
			mapStack.aisles.features.push(mapStack.aisles.features[0]);
		});

		testDuplicate(mapStack => {
			mapStack.workflowPoints.features.push(mapStack.workflowPoints.features[0]);
		});

		testDuplicate(mapStack => {
			mapStack.logical.features[0].properties.type = 'queue';
			mapStack.logical.features.push(mapStack.logical.features[0]);
		});

		testDuplicate(mapStack => {
			mapStack.logical.features[0].properties.type = 'stayOnPath';
			mapStack.logical.features.push(mapStack.logical.features[0]);
		});

		testDuplicate(mapStack => {
			mapStack.logical.features[0].properties.type = 'speedLimit';
			mapStack.logical.features.push(mapStack.logical.features[0]);
		});
	});

	it('validates that feature names are not empty', () => {
		const errors = [];
		const mapStack = cloneDeep(map) as MapStack;
		mapStack.aisles.features[0].properties.name = '';
		mapStack.workflowPoints.features[0].properties.name = '';
		mapStack.logical.features[0].properties.name = '';
		mapStack.logical.features[0].properties.type = 'queue';
		mapStack.logical.features[1].properties.name = '';
		mapStack.logical.features[1].properties.type = 'stayOnPath';
		mapStack.logical.features[2].properties.name = '';
		mapStack.logical.features[2].properties.type = 'speedLimit';
		const isValid = validate(mapStack, errors);

		const errorContexts = errors.map(e => e.path);
		assert.sameDeepMembers(errorContexts, [
			'.workflowPoints.features[0].properties.name',
			'.workflowPoints.features[0].properties.name',
			'.aisles.features[0].properties.name',
			'.aisles.features[0].properties.name',
			'.aisles.features[0].properties.name',
			'.workflowPoints.features[0].properties.name',
			'.logical.features[0].properties.name',
			'.logical.features[1].properties.name',
			'.logical.features[2].properties.name',
		]);
		const errorIds = errors.map(e => e.id);
		assert.sameMembers(errorIds, [
			'04fcd25f-229f-4655-b7e3-0664871b6e8c',
			'04fcd25f-229f-4655-b7e3-0664871b6e8c',
			'37a7891d-f3aa-435d-b4e9-1eb766ba29a1',
			'37a7891d-f3aa-435d-b4e9-1eb766ba29a1',
			'37a7891d-f3aa-435d-b4e9-1eb766ba29a1',
			'04fcd25f-229f-4655-b7e3-0664871b6e8c',
			'0c2d0554-a436-4bcc-941d-ca516ccb5638',
			'49803cc0-c049-4f03-9721-be769394801b',
			'55746026-b5d4-4aef-8334-eb3a3096f510',
		]);
		assert.isNotOk(isValid);
	});

	it('Validates A workflow point has no labels', () => {
		const error = [];
		const mapStackClone = cloneDeep(simple) as MapStack;
		mapStackClone.workflowPoints.features[0].properties.labels = [];
		const isValid = validate(mapStackClone, error);
		assert.equal(error.length, 1);
		assert.isNotOk(isValid);
	});

	it('validates that names have no tailing spaces', () => {
		const error = [];
		const mapStackClone = cloneDeep(simple) as MapStack;
		mapStackClone.workflowPoints.features[0].properties.name = '  leading spaces';
		let isValid = validate(mapStackClone, error);
		assert.equal(error.length, 1);
		assert.isNotOk(isValid);

		mapStackClone.workflowPoints.features[0].properties.name = 'tailing spaces  ';
		isValid = validate(mapStackClone, error);
		assert.equal(error.length, 1);
		assert.isNotOk(isValid);

		mapStackClone.workflowPoints.features[0].properties.name = 'special characters ()-:_0123456789';
		isValid = validate(mapStackClone, error);
		assert.equal(error.length, 0);
		assert.isOk(isValid);
	});

	xit('validates that workflow points are not inside impassable or keepOutArea', () => {});
});
