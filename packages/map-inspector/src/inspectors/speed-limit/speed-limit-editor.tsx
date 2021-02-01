import React, { useContext } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { NameEditor } from '../header/name-editor';
import { RectangleEditor } from '../geometry/rectangle-editor';
import { InspectorHeader } from '../header/inspector-header';
import { FormContext } from '../form-context';
/**
 * Inspect speed limit area information, displayed as a form
 */
export function SpeedLimitAreaEditor() {
	const {
		fields: { maxVelocity },
	} = useContext(FormContext);
	return (
		<FormLayout>
			<InspectorHeader />
			<NameEditor />
			<TextField type="number" step={0.1} label="Max Velocity (m/s)" {...maxVelocity} />
			<RectangleEditor />
		</FormLayout>
	);
}
