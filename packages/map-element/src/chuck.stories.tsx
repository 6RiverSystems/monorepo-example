/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { number, text, boolean } from '@storybook/addon-knobs';

import { reactDecorator } from '../../../tools/storybook/react-decorator';
import { Chuck, MfpDimensions } from './chuck';

export default { title: 'Chuck', decorators: [reactDecorator()] };

const styles = css`
	/* We have to override the dimensions to render Chuck in storybook.
		The Chuck actual dimensions are tied to the map coordinate system */
	svg {
		width: ${200 * MfpDimensions.width}px !important;
		height: ${200 * MfpDimensions.length}px !important;
	}
`;

export function primary() {
	const orientation = number('orientation', 90, { min: 0, max: 360, step: 1 });
	const name = text('name', 'mfp-debug');
	const picker = boolean('picker', true);
	return (
		<div css={styles}>
			<Chuck picker={picker} name={name} id={name} />
		</div>
	);
}
