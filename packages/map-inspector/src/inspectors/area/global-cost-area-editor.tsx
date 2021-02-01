import React, { useCallback, useState } from 'react';
import { TextField, FormLayout } from '@shopify/polaris';

import { NameEditor } from '../header/name-editor';
import { RectangleEditor } from '../geometry/rectangle-editor';
import { InspectorHeader } from '../header/inspector-header';
/**
 * Inspect global cost area information, displayed as a form.
 * Global cost area is an equally weighted area.
 * Purpose is to simplify creating an equally weighted area.
 * Global cost area only has 1 cost, a weighted area has 9 costs.
 * Global cost area's are observed by the global path planner on Chuck.
 */
export function GlobalCostAreaEditor({ feature }) {
	const [cost, setCost] = useState(feature[0].properties.cost);
	const handleCost = useCallback(newValue => setCost(newValue), []);
	return (
		<FormLayout>
			<InspectorHeader type={feature[0].properties.type} id={feature[0].properties.id} />
			<NameEditor title={feature[0].properties.name} />
			<TextField label="Cost" onChange={handleCost} value={cost} />
			<RectangleEditor bounds={feature[0].bounds} />
		</FormLayout>
	);
}
