import { assert } from 'chai';
import React from 'react';
import { CostAreaState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

const localCostAreaFeature: CostAreaState = {
	properties: { name: '', cost: 200, type: 'costArea', id: '0009cfa9-0df5-44a7-9dd0-531581e73426' },
	bounds: [
		[111, 222],
		[444, 333],
	],
};

const updatedCostAreaFeature: CostAreaState = {
	properties: {
		name: 'newName',
		cost: 100,
		type: 'costArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
	},
	bounds: [
		[1, 222],
		[444, 3],
	],
};

describe('Local Cost Area', () => {
	it('should render a local cost area inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[localCostAreaFeature]} />),
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
			<MapInspector features={[localCostAreaFeature]} callback={callback} />,
		);
		getAllByText('Local Cost Area');
		getByText(localCostAreaFeature.properties.id);

		const elementName = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementName.value, '');

		const elementCost = getByLabelText('Cost') as HTMLTextAreaElement;
		assert.equal(elementCost.value, '200');

		getByDisplayValue(String(localCostAreaFeature.bounds[0][1]));
		getByDisplayValue(String(localCostAreaFeature.bounds[0][0]));
		getByDisplayValue(String(localCostAreaFeature.bounds[1][0]));
		getByDisplayValue(String(localCostAreaFeature.bounds[1][1]));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String(localCostAreaFeature.bounds[0][0])), {
			target: { value: 1 },
		});
		fireEvent.change(getByDisplayValue(String(localCostAreaFeature.bounds[1][1])), {
			target: { value: 3 },
		});

		fireEvent.change(getByLabelText('Cost'), { target: { value: 100 } });

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedCostAreaFeature);
	});
});
