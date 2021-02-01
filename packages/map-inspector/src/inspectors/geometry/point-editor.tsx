import React, { useContext } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { FormContext } from '../form-context';
import { geometryStyle } from '../inspector-style';
/**
 * Inspect X,Y coordinates of a workflow point, displayed in the workflow point form
 */
export function PointEditor() {
	const {
		fields: { x, y },
	} = useContext(FormContext);

	return (
		<React.Fragment>
			<h1 css={geometryStyle}>Position (meters)</h1>
			<FormLayout.Group condensed>
				<TextField type="number" label="X" {...x} />
				<TextField type="number" label="Y" {...y} />
			</FormLayout.Group>
		</React.Fragment>
	);
}
