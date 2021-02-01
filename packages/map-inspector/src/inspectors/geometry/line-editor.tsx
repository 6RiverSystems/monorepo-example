import React, { useContext } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { geometryStyle } from '../inspector-style';
import { FormContext } from '../form-context';

/**
 * Inspect X,Y coordinates of an aisle, displayed in the aisle form
 */
export function LineEditor() {
	const {
		fields: { tailX, tailY, headX, headY },
	} = useContext(FormContext);
	return (
		<React.Fragment>
			<h1 css={geometryStyle}>Position (meters)</h1>
			<FormLayout.Group condensed title="Start">
				<TextField type="number" label="X" {...tailX} />
				<TextField type="number" label="Y" {...tailY} />
			</FormLayout.Group>
			<FormLayout.Group condensed title="End">
				<TextField type="number" label="X" {...headX} />
				<TextField type="number" label="Y" {...headY} />
			</FormLayout.Group>
		</React.Fragment>
	);
}
