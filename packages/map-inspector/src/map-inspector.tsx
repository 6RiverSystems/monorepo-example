import React, { useState, useCallback } from 'react';
import { AisleState, WorkflowPointState, AreasState } from '@sixriver/map-io';
import { useSubmit } from '@shopify/react-form';
import { Form, Button, Card, Tabs, FormLayout, DisplayText } from '@shopify/polaris';

import { FeatureEditor } from './inspector';
import '@shopify/polaris/styles.css';
import { createFields, getTypes, getTabs, getFilteredFeatures } from './create-fields';
import { applyFormToFeatures } from './apply-form';
import { FormContext } from './inspectors/form-context';

export type Feature = WorkflowPointState | AisleState | AreasState;

/* On submit, call the callback to update feature information */
export interface MapInspectorProps {
	features?: Feature[];
	callback?: (features: Feature[]) => void;
	zoneLabels?: string[];
}

export const MapInspector = ({ features, callback, zoneLabels }: MapInspectorProps) => {
	if (!features.length) {
		return <DisplayText size="small">Nothing Selected.</DisplayText>;
	}

	const types = getTypes(features);
	const tabs = getTabs(types, features);
	const [tabIndex, setTabIndex] = useState(0);

	/** Based on tab selection, filteredFeatures is the array of all features of that type */
	const [filteredFeatures, setFilteredFeatures] = useState(
		getFilteredFeatures(features, tabs[tabIndex]['id']),
	);
	/** Initialize totalFields with multiple feature type's information from map stack */
	const totalFields = createFields(features, types, zoneLabels);

	const handleTabChange = useCallback(selectedTabIndex => {
		setTabIndex(selectedTabIndex);
		setFilteredFeatures(getFilteredFeatures(features, tabs[selectedTabIndex]['id']));
	}, []);

	/** Initialize fields with one feature type's information from map stack */
	const fields = totalFields[tabs[tabIndex]['id']];

	/** On submit, update feature information to be passed back to map stack */
	const { submit } = useSubmit(async fieldValues => {
		const updatedFeatures = applyFormToFeatures(filteredFeatures, fieldValues);
		if (callback) {
			callback(updatedFeatures);
		}
		return { status: 'success' };
	}, fields);

	const form = (
		<FormContext.Provider
			value={{
				fields,
				count: filteredFeatures.length,
				multi: filteredFeatures.length > 1,
			}}
		>
			<FeatureEditor features={filteredFeatures} />
		</FormContext.Provider>
	);

	return (
		<Form onSubmit={submit}>
			<FormLayout>
				{types.length > 1 ? (
					<Tabs tabs={tabs} selected={tabIndex} onSelect={handleTabChange} fitted>
						<Card.Section>{form}</Card.Section>
					</Tabs>
				) : (
					<div>{form}</div>
				)}

				<Button primary size="large" submit>
					Submit
				</Button>
			</FormLayout>
		</Form>
	);
};
