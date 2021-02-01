import { assert } from 'chai';
import React from 'react';
import { WorkflowPointState } from '@sixriver/map-io';
import { MapInspector, MapInspectorProps } from '../../map-inspector';
import { fireEvent } from '@testing-library/react';
import { renderWithAppProvider } from '../render-app-provider';

describe('Multi Workflow Point', () => {
	const areaFeature: WorkflowPointState = {
		properties: {
			name: 'home',
			type: 'workflowPoint',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			object: 'vertex',
			orientation: 270,
			labels: ['label1', 'label2'],
			workflowOptions: ['option1'],
		},
		position: [1, 11],
	};

	const areaFeature1: WorkflowPointState = {
		properties: {
			name: 'takeoff',
			type: 'workflowPoint',
			target: 'induct',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			object: 'vertex',
			orientation: 270,
			labels: ['label1', 'label2'],
			workflowOptions: ['option2'],
		},
		position: [1, 11],
	};

	const areaFeatures = [areaFeature, areaFeature1];

	it('should render a aisle inspector with multiple features successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={areaFeatures} />));
	});

	it('should render the form fields correctly', async () => {
		const {
			getByLabelText,
			getByText,
			getByDisplayValue,
			getAllByText,
			queryByText,
		} = renderWithAppProvider(<MapInspector features={areaFeatures} />);

		getAllByText('Workflow Point');
		getByText('Selected 2 features');

		const elementName = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementName.value, '');

		getAllByText('generic');
		getByText('label1');
		getByText('label2');
		assert.isNull(queryByText('option1'));
		getByText('Tags vary across selected features');
		getByDisplayValue('1');
		getByDisplayValue('11');
	});

	it('should render and submit the type field correctly', async () => {
		const areaFeature: WorkflowPointState = {
			properties: {
				name: 'home',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'workflowPoint',
				target: 'induct',
				orientation: 100,
				object: 'vertex',
				labels: ['label1', 'label2'],
				workflowOptions: ['option1'],
			},
			position: [1, 11],
		};

		const areaFeature1: WorkflowPointState = {
			properties: {
				name: 'takeoff',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'workflowPoint',
				target: 'induct',
				orientation: 270,
				object: 'vertex',
				labels: ['label1', 'label2'],
				workflowOptions: ['option2'],
			},
			position: [1, 11],
		};

		const areaFeatures = [areaFeature, areaFeature1];
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getAllByText, getByRole } = renderWithAppProvider(
			<MapInspector features={areaFeatures} callback={callback} />,
		);

		getAllByText('induct');
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(areaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});

	it('should change the orientation fields correctly', async () => {
		const updatedFeature: WorkflowPointState = {
			properties: {
				name: 'home',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'workflowPoint',
				target: 'generic',
				orientation: 180,
				object: 'vertex',
				labels: ['label1', 'label2'],
				workflowOptions: ['option1'],
			},
			position: [2, 11],
		};

		const updatedFeature2: WorkflowPointState = {
			properties: {
				name: 'takeoff',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'workflowPoint',
				target: 'induct',
				orientation: 180,
				object: 'vertex',
				labels: ['label1', 'label2'],
				workflowOptions: ['option2'],
			},
			position: [2, 11],
		};

		const updatedFeatures = [updatedFeature, updatedFeature2];

		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={areaFeatures} callback={callback} />,
		);

		fireEvent.change(getByLabelText('Orientation (degrees)'), { target: { value: 180 } });
		fireEvent.change(getByDisplayValue('1'), {
			target: { value: 2 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});
