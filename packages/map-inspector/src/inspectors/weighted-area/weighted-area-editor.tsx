/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormLayout } from '@shopify/polaris';

import { NameEditor } from '../header/name-editor';
import { RectangleEditor } from '../geometry/rectangle-editor';
import { InspectorHeader } from '../header/inspector-header';
import { AutoDirectionEditor } from './weighted-area-auto-editor';

/**
 * Inspect weighted area information, displayed as a form.
 */
export function WeightedAreaEditor() {
	return (
		<FormLayout>
			<InspectorHeader />
			<NameEditor />
			<AutoDirectionEditor />
			<RectangleEditor />
		</FormLayout>
	);
}
