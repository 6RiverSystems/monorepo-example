import { assert } from 'chai';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { AisleState, WorkflowPointState } from '@sixriver/map-io';
import { MapInspectorProps, MapInspector } from './map-inspector';
import { renderWithAppProvider } from './inspectors/render-app-provider';

const aisleFeature: AisleState = {
	properties: {
		name: '24-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		type: 'aisle',
		object: 'aisle',
		labels: ['ssss'],
		directed: true,
	},
	points: [
		[3, 11],
		[5, 13],
	],
};

const aisleFeature2: AisleState = {
	properties: {
		name: '23-aisle',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		type: 'aisle',
		object: 'aisle',
		labels: ['hiiiii', 'ssss'],
		directed: true,
	},
	points: [
		[23, 11],
		[10, 13],
	],
};

const workflowPointFeature: WorkflowPointState = {
	properties: {
		name: 'home',
		type: 'workflowPoint',
		target: 'generic',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 270,
		labels: ['label1', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [1, 11],
};

const updatedWorkflowPointFeature: WorkflowPointState = {
	properties: {
		name: 'newName',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 270,
		labels: ['dog', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [1, 2],
};

const features = [aisleFeature, aisleFeature2, workflowPointFeature, updatedWorkflowPointFeature];

describe('Multi Select', () => {
	it('should render a multi select inspector successfully', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		assert.doesNotThrow(() =>
			renderWithAppProvider(
				<MapInspector features={features} callback={callback} zoneLabels={['zone-1', 'zone-2']} />,
			),
		);
	});

	it('change inspector based on tab selection', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getAllByText } = renderWithAppProvider(
			<MapInspector features={features} callback={callback} zoneLabels={['zone-1', 'zone-2']} />,
		);

		fireEvent.click(getAllByText('Workflow Point (2)')[0]);
		getAllByText('generic');

		fireEvent.click(getAllByText('Aisle (2)')[0]);
		getByText('Swap Direction');
	});
});
