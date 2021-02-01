import { assert } from 'chai';
import { MapStackData, MapStack, parse } from '@sixriver/map-io';

import simple from '../../../../tools/test-fixtures/map-stack/simple.json';
import {
	noopScale,
	unscale,
	scaleMin,
	scaleMax,
	calculateBounds,
	transformFromTranslateAndScale,
	transformAroundPointWithScale,
	transformFromZoomBounds,
} from './view';

describe('View', () => {
	it('should noopScale correctly', () => {
		assert.equal(noopScale(19), 1);
		assert.equal(noopScale(0.1), 1);
	});

	it('should unscale correctly', () => {
		assert.equal(unscale(5), 0.2);
		assert.equal(unscale(0.25), 4);
	});

	it('should scaleMin correctly', () => {
		assert.equal(scaleMin(0.5), 2);
		assert.equal(scaleMin(5), 1);
	});

	it('should scaleMax correctly', () => {
		assert.equal(scaleMax(10), 0.1);
		assert.equal(scaleMax(0.5), 1);
	});

	it('should transformFromTranslateAndScale correctly', () => {
		assert.deepEqual(transformFromTranslateAndScale({ x: 10, y: -20 }, 2.5), {
			translate: { x: 10, y: -20 },
			scale: 2.5,
		});
	});

	it('should transformAroundPointWithScale correctly', () => {
		const bounds = { x1: -100, y1: -100, x2: 100, y2: 100 };
		assert.deepEqual(
			transformAroundPointWithScale({ x: 10, y: -20 }, 2.5, {
				bounds,
				scale: 1,
				translate: { x: 0, y: 0 },
			}),
			{
				translate: { x: -6, y: 12 },
				scale: 2.5,
			},
		);
	});

	it('should transformFromZoomBounds correctly', () => {
		const bounds = { x1: -100, y1: -100, x2: 100, y2: 100 };
		// for the same bounds no scale or translate
		assert.deepEqual(transformFromZoomBounds(bounds, bounds), {
			translate: { x: 0, y: 0 },
			scale: 1,
		});
		// zoom top left corner
		assert.deepEqual(transformFromZoomBounds(bounds, { x1: -100, y1: -100, x2: 0, y2: 0 }), {
			translate: { x: 50, y: 50 },
			scale: 2,
		});
		// zoom bottom right
		assert.deepEqual(transformFromZoomBounds(bounds, { x1: 0, y1: 0, x2: 100, y2: 100 }), {
			translate: { x: -50, y: -50 },
			scale: 2,
		});
		// scale to fit vertical
		assert.deepEqual(transformFromZoomBounds(bounds, { x1: -20, y1: -60, x2: 20, y2: 40 }), {
			translate: { x: 0, y: 10 },
			scale: 2,
		});
		// scale to fit horizontal
		assert.deepEqual(transformFromZoomBounds(bounds, { x1: -60, y1: -20, x2: 40, y2: 20 }), {
			translate: { x: 10, y: 0 },
			scale: 2,
		});
	});

	it('should calculate the bounds for a map-stack', async () => {
		const mapStackData: MapStackData = parse(simple as MapStack);
		const bounds = calculateBounds(mapStackData);
		assert.deepEqual(bounds, { x1: 16.1, x2: 18.1, y1: -10, y2: -1.95 });
	});
});
