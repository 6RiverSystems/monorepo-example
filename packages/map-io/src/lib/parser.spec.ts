import { assert } from 'chai';

import { MapStackData } from './interfaces/map-stack';
import { MapStack } from './interfaces/map-stack-json';
import { parse } from './parser';
import xpomem from '../../../../tools/test-fixtures/map-stack/xpomem.json';
import empty from '../../../../tools/test-fixtures/map-stack/empty.json';
import simple from '../../../../tools/test-fixtures/map-stack/simple.json';

describe('Parser', () => {
	it('parses a map-stack', () => {
		const mapStack: MapStackData = parse(xpomem as MapStack);
		assert.equal(18, mapStack.workflowPoints.length);
		assert.equal(40, mapStack.aisles.length);
		assert.equal(313, mapStack.areas.length);
	});

	it('parses an empty map', () => {
		const mapStack: MapStackData = parse(empty as MapStack);
		assert.isEmpty(mapStack.workflowPoints);
		assert.isEmpty(mapStack.aisles);
		assert.isEmpty(mapStack.areas);
	});

	it('throws when map-stack is not valid', () => {
		assert.throws(() => {
			parse({ ...simple, origin: false } as any);
		});
		assert.throws(() => {
			parse({ ...simple, resolution: 'foo-bar' } as any);
		});
		assert.throws(() => {
			parse({ ...simple, logical: { features: 10 } } as any);
		});
	});

	it('parses features correctly', () => {
		const mapStack: MapStackData = parse(simple as MapStack);
		assert.equal(mapStack.areas[0].properties.type, 'impassable');
		assert.equal(mapStack.areas[0].properties.id, '0c2d0554-a436-4bcc-941d-ca516ccb5638');
		assert.equal(mapStack.areas[0].properties.name, 'Border');
		assert.equal(mapStack.workflowPoints[0].properties.type, 'workflowPoint');
		assert.equal(mapStack.workflowPoints[0].properties.id, '04fcd25f-229f-4655-b7e3-0664871b6e8c');
		assert.equal(mapStack.workflowPoints[0].properties.name, 'Picking 1');
		assert.equal(mapStack.workflowPoints[0].properties.orientation, 180);
		assert.deepEqual(
			mapStack.workflowPoints[0].position,
			simple.workflowPoints.features[0].geometry.coordinates,
		);
		assert.deepEqual(
			mapStack.workflowPoints[0].properties.labels,
			simple.workflowPoints.features[0].properties.labels,
		);
		assert.deepEqual(
			mapStack.workflowPoints[0].properties.workflowOptions,
			simple.workflowPoints.features[0].properties.workflowOptions,
		);
		assert.equal(mapStack.aisles[0].properties.type, 'aisle');
		assert.equal(mapStack.aisles[0].properties.id, '37a7891d-f3aa-435d-b4e9-1eb766ba29a1');
		assert.equal(mapStack.aisles[0].properties.name, 'S-01');
		assert.equal(mapStack.aisles[0].properties.directed, false);
		assert.deepEqual(
			mapStack.aisles[0].properties.labels,
			simple.aisles.features[0].properties.labels,
		);
	});
});
