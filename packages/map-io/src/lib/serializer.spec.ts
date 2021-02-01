import { assert } from 'chai';

import { MapStackData } from './interfaces/map-stack';
import { MapStack } from './interfaces/map-stack-json';
import { serialize } from './serializer';
import { parse } from './parser';
import xpomem from '../../../../tools/test-fixtures/map-stack/xpomem.json';

describe('Serializer', () => {
	it('parses and serializes back a map-stack', () => {
		const mapStack: MapStackData = parse(xpomem as MapStack);
		const object = JSON.parse(serialize(mapStack));
		assert.deepEqual(object, xpomem);
	});
});
