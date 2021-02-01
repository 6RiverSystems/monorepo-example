import { render, wait } from '@testing-library/react';
import { assert } from 'chai';
import React from 'react';
import { MapStack } from '@sixriver/map-io';

import { StaticMap } from './static-map';
import xpomem from '../../../../tools/test-fixtures/map-stack/xpomem.json';

describe('Map', () => {
	it('should render a map successfully', () => {
		assert.doesNotThrow(() => render(<StaticMap mapStack={xpomem as MapStack} />));
	});

	it('should render a map with all the areas rendered', async () => {
		const { container } = render(
			<StaticMap
				mapStack={xpomem as MapStack}
				showAisle={true}
				showCostArea={true}
				showKeepOutArea={true}
				showPlaySoundArea={true}
				showQueueArea={true}
				showStayOnPathArea={true}
				showSpeedLimitArea={true}
				showWeightedArea={true}
				showWorkflowPoint={true}
			/>,
		);
		await wait();
		let elements = container.querySelectorAll('.stack-aisle');
		assert.isNotEmpty(elements, 'stack-aisle');
		elements = container.querySelectorAll('.stack-impassable');
		assert.isNotEmpty(elements, 'stack-impassable');
		elements = container.querySelectorAll('.stack-costarea');
		assert.isNotEmpty(elements, 'stack-costarea');
		elements = container.querySelectorAll('.stack-keepout');
		assert.isNotEmpty(elements, 'stack-keepout');
		elements = container.querySelectorAll('.stack-queue');
		assert.isNotEmpty(elements, 'stack-queue');
		elements = container.querySelectorAll('.stack-stayonpath');
		assert.isNotEmpty(elements, 'stack-stayonpath');
		elements = container.querySelectorAll('.stack-weighted-north');
		assert.isNotEmpty(elements, 'stack-weighted-north');
	});
});
