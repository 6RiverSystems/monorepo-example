/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { geometryStyle } from '../inspector-style';
import { FormContext } from '../form-context';
/**
 * Inspect X,Y coordinates of a rectangle area, displayed in the area form
 */
export function RectangleEditor() {
	const {
		fields: { northEastX, northEastY, southWestX, southWestY },
	} = useContext(FormContext);

	return (
		<React.Fragment>
			<h1 css={geometryStyle}>Position (meters)</h1>
			<FormLayout.Group condensed title="South West">
				<TextField type="number" label="X" {...southWestX} />
				<TextField type="number" label="Y" {...southWestY} />
			</FormLayout.Group>
			<FormLayout.Group condensed title="North East">
				<TextField type="number" label="X" {...northEastX} />
				<TextField type="number" label="Y" {...northEastY} />
			</FormLayout.Group>
		</React.Fragment>
	);
}
