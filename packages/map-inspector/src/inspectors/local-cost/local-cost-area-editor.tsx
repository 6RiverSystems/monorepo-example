import React, { useContext } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { NameEditor } from '../header/name-editor';
import { RectangleEditor } from '../geometry/rectangle-editor';
import { InspectorHeader } from '../header/inspector-header';
import { FormContext } from '../form-context';
/**
 * Inspect local cost area information, displayed as a form
 * Local cost area is the same as a cost area types
 * Local cost area's are only observed by the local path planner on Chuck
 */
export function LocalCostAreaEditor() {
	const {
		fields: { cost },
	} = useContext(FormContext);
	return (
		<FormLayout>
			<InspectorHeader />
			<NameEditor />
			<TextField type="number" label="Cost" {...cost} />
			<RectangleEditor />
		</FormLayout>
	);
}
