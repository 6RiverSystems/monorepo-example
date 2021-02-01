import React from 'react';
import { FormLayout } from '@shopify/polaris';

import { NameEditor } from '../header/name-editor';
import { RectangleEditor } from '../geometry/rectangle-editor';
import { InspectorHeader } from '../header/inspector-header';
/**
 * Inspect impassable, keepOut, queue, stayOnPath information, displayed as a form
 */
export function AreaEditor() {
	return (
		<FormLayout>
			<div>
				<InspectorHeader />
				<NameEditor />
				<br />
				<RectangleEditor />
			</div>
		</FormLayout>
	);
}
