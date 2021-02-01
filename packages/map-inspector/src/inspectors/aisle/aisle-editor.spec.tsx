import { assert } from 'chai';
import React from 'react';
import { AisleState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';

import { MapInspector, MapInspectorProps } from '../../map-inspector';
import { renderWithAppProvider } from '../render-app-provider';

const aisleFeature: AisleState = {
	properties: {
		name: '24-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-2'],
		directed: true,
	},
	points: [
		[23, 11],
		[10, 13],
	],
};

const updatedFeature: AisleState = {
	properties: {
		name: '24-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-2'],
		directed: false,
	},
	points: [
		[5, 11],
		[10, 13],
	],
};

const updatedFeature2: AisleState = {
	properties: {
		type: 'aisle',
		object: 'aisle',
		directed: true,
		labels: ['zone-2'],
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		name: '24-south',
	},
	points: [
		[10, 13],
		[23, 11],
	],
};

describe('Aisle', () => {
	it('should render an aisle inspector successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={[aisleFeature]} />));
	});

	it('should render the form fields correctly', async () => {
		const { getByLabelText, getByText, getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[aisleFeature]} zoneLabels={['zone-1', 'zone-2']} />,
		);

		getAllByText('Aisle');
		getByText(aisleFeature.properties.id);

		const elementName = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementName.value, '24-south');

		const elementDirected = getByLabelText('One Way Aisle') as HTMLInputElement;
		assert.isTrue(elementDirected.checked);

		getByText('zone-2');

		getByDisplayValue(String(aisleFeature.points[0][0]));
		getByDisplayValue(String(aisleFeature.points[0][1]));
		getByDisplayValue(String(aisleFeature.points[1][0]));
		getByDisplayValue(String(aisleFeature.points[1][1]));
	});

	it('should update form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByDisplayValue, getByRole, getByText } = renderWithAppProvider(
			<MapInspector
				features={[aisleFeature]}
				callback={callback}
				zoneLabels={['zone-1', 'zone-2']}
			/>,
		);

		fireEvent.change(getByDisplayValue(String(aisleFeature.points[0][0])), {
			target: { value: 5 },
		});
		getByDisplayValue('5');
		fireEvent.click(getByText('Two Way Aisle'));

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedFeature);
	});

	it('should swap line coordinate fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByRole, getByText } = renderWithAppProvider(
			<MapInspector
				features={[aisleFeature]}
				callback={callback}
				zoneLabels={['zone-1', 'zone-2']}
			/>,
		);

		fireEvent.click(getByText('Swap Direction'));

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedFeature2);
	});
});
