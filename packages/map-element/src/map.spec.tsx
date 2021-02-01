import { render, wait } from '@testing-library/react';
import { assert } from 'chai';
import React from 'react';
import { MapStack, parse } from '@sixriver/map-io';

import { Map } from './map';
import xpomem from '../../../tools/test-fixtures/map-stack/xpomem.json';

describe('Map', () => {
	it('should render a map successfully with a MapStack', () => {
		assert.doesNotThrow(() => render(<Map mapStack={xpomem as MapStack} />));
	});

	it('should render a map successfully with MapStackData', () => {
		assert.doesNotThrow(() => render(<Map mapStack={parse(xpomem as MapStack)} />));
	});

	it('should show an error message for a null mapStack', () => {
		const { findByText } = render(<Map mapStack={null} />);
		findByText('Failed to load map stack');
	});

	it('should show an error message when parsing failed', () => {
		const { findByText } = render(<Map mapStack={{ badMap: true } as any} />);
		findByText('Failed to load map stack');
	});
});
