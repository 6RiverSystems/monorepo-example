import { assert } from 'chai';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithAppProvider } from '../render-app-provider';
import { WorkflowPointState } from '@sixriver/map-io';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

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
		name: 'home',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 180,
		labels: ['restage', 'label1', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [21, 11],
};

const updatedWorkflowPointFeature2: WorkflowPointState = {
	properties: {
		name: 'home',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 180,
		labels: ['label2'],
		workflowOptions: ['option1'],
	},
	position: [21, 11],
};

const updatedWorkflowPointFeature3: WorkflowPointState = {
	properties: {
		name: 'home',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 180,
		labels: ['label1', 'label2', 'newtag'],
		workflowOptions: ['option1'],
	},
	position: [21, 11],
};

describe('Tag Editor', () => {
	it('should add a tag correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getAllByText, getByText, getByLabelText, getByRole } = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);
		getByText('label1');
		getByText('label2');

		fireEvent.click(getByLabelText('Labels'));
		getAllByText('induct');
		getByText('restage');

		fireEvent.click(getByText('restage'));
		assert.lengthOf(getAllByText('restage'), 2);

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedWorkflowPointFeature);
	});

	it('should delete the tags correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, queryByText } = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);

		getByText('label1');
		fireEvent.click(getByRole('button', { name: 'Remove label1' }));
		assert.isNull(queryByText('label1'));

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedWorkflowPointFeature2);
	});

	it('should add a tag with spacebar correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);

		fireEvent.change(getByLabelText('Labels'), { target: { value: 'newtag ' } });
		getByText('newtag');

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedWorkflowPointFeature3);
	});

	it('should filter the suggested tags correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { queryByText, getByLabelText, getAllByText } = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);

		fireEvent.change(getByLabelText('Labels'), { target: { value: 'res' } });
		fireEvent.click(getByLabelText('Labels'));
		assert.lengthOf(getAllByText('restage'), 1);
		assert.isNull(queryByText('userDirectedInduct'));
	});
});
