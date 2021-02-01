import { assert } from 'chai';
import React from 'react';
import { WeightedAreaState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

const weightedAreaFeature: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 200,
		ne: 200,
		nw: 200,
		s: 0,
		se: 0,
		sw: 0,
		e: 0,
		w: 0,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const updatedWeightedAreaFeature: WeightedAreaState = {
	properties: {
		name: 'newName',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 100,
		ne: 100,
		nw: 100,
		s: 0,
		se: 0,
		sw: 0,
		e: 0,
		w: 0,
	},
	bounds: [
		[1, 222],
		[223, 3],
	],
};

describe('Weighted Area', () => {
	it('should render a weighted area inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[weightedAreaFeature]} />),
		);
	});

	it('should render the auto form fields correctly', async () => {
		const { getByText, getByLabelText, getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeature]} />,
		);
		getAllByText('Weighted Area');
		getByText(weightedAreaFeature.properties.id);

		const elementNameTextField = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementNameTextField.value, '');

		getByDisplayValue(String(weightedAreaFeature.bounds[0][1]));
		getByDisplayValue(String(weightedAreaFeature.bounds[0][0]));
		getByDisplayValue(String(weightedAreaFeature.bounds[1][0]));
		getByDisplayValue(String(weightedAreaFeature.bounds[1][1]));
	});

	it('should update feature information correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeature]} callback={callback} />,
		);

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByLabelText('Cost'), {
			target: { value: 100 },
		});
		getByDisplayValue('100');

		fireEvent.change(getByDisplayValue(String(weightedAreaFeature.bounds[0][0])), {
			target: { value: 1 },
		});
		fireEvent.change(getByDisplayValue(String(weightedAreaFeature.bounds[1][1])), {
			target: { value: 3 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedWeightedAreaFeature);
	});
});
