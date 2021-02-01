import { render, wait } from '@testing-library/react';
import { assert } from 'chai';
import React from 'react';

import { Marker, MarkerProps } from './marker';
import { scaleMax, noopScale } from './view';

const TargetSVG = (props: MarkerProps) => {
	return (
		<Marker test-id="svg-marker" {...props} size={{ x: 1, y: 1 }}>
			<svg viewBox="0 0 100 50" width="1" height="1">
				...
			</svg>
		</Marker>
	);
};

export const TargetPart = (props: MarkerProps) => {
	const width = 1;
	const height = 0.5;
	return (
		<Marker test-id="part-marker" {...props} size={{ x: width, y: height }}>
			<rect width={width} height={height} />
		</Marker>
	);
};

describe('Marker', () => {
	it('should render a marker successfully', () => {
		assert.doesNotThrow(() => render(<Marker />));
	});

	it('should render a marker with an svg element', () => {
		const { findByTestId } = render(<TargetSVG scalingFn={scaleMax} />);
		findByTestId('svg-marker');
	});

	it('should render a marker with an svg part', () => {
		const { findByTestId } = render(<TargetPart scalingFn={noopScale} animationDuration={1000} />);
		findByTestId('part-marker');
	});
});
