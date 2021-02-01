import { assert } from 'chai';
import React from 'react';
import { WorkflowPointState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

import { renderWithAppProvider } from '../render-app-provider';
import { workflowPointLabels } from './workflow-point-labels';
import { workflowPointOptions } from './workflow-point-options';

const workflowPointFeature: WorkflowPointState = {
	properties: {
		name: 'home',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 180,
		labels: ['label1', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [21, 11],
};

const updatedWorkflowPointFeature: WorkflowPointState = {
	properties: {
		name: 'newName',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 270,
		labels: ['label1', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [1, 2],
};

const inductLabels = [
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
];

const inductOptions = [
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
];

describe('Workflow Point', () => {
	it('should render a workflow point inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[workflowPointFeature]} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getAllByText,
			getByText,
			getByLabelText,
			getByDisplayValue,
			getByRole,
		} = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);
		getAllByText('Workflow Point');
		getByText(workflowPointFeature.properties.id);

		const elementNameTextField = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementNameTextField.value, 'home');

		const elementOrientation = getByLabelText('Orientation (degrees)') as HTMLTextAreaElement;
		assert.equal(elementOrientation.value, '180');

		const elementSuggestedLabels = workflowPointLabels('induct');
		assert.deepEqual(inductLabels, elementSuggestedLabels);
		const elementSuggestedOptions = workflowPointOptions('induct');
		assert.deepEqual(inductOptions, elementSuggestedOptions);

		getByDisplayValue(String(workflowPointFeature.position[0]));
		getByDisplayValue(String(workflowPointFeature.position[1]));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByLabelText('Orientation (degrees)'), { target: { value: 270 } });

		fireEvent.change(getByDisplayValue(String(workflowPointFeature.position[0])), {
			target: { value: 1 },
		});
		fireEvent.change(getByDisplayValue(String(workflowPointFeature.position[1])), {
			target: { value: 2 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedWorkflowPointFeature);
	});
});
