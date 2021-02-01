import React, { useContext } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { FormContext } from '../form-context';

/**
 * Display direction info of a weighted area. Allows user
 * to edit each direction manually.
 */
export function ManualDirectionEditor() {
	const {
		fields: { n, ne, nw, s, se, sw, e, w },
	} = useContext(FormContext);
	return (
		<React.Fragment>
			<br />
			<h1>Weighted Directions</h1>
			<FormLayout.Group condensed>
				<TextField type="number" label="North" {...n} />
				<TextField type="number" label="North East" {...ne} />
				<TextField type="number" label="North West" {...nw} />
				<TextField type="number" label="South" {...s} />
				<TextField type="number" label="South East" {...se} />
				<TextField type="number" label="South West" {...sw} />
				<TextField type="number" label="East" {...e} />
				<TextField type="number" label="West" {...w} />
			</FormLayout.Group>
		</React.Fragment>
	);
}
