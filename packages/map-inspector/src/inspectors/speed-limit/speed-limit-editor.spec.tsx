import { assert } from 'chai';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { SpeedLimitAreaState } from '@sixriver/map-io';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

const speedLimitAreaFeature: SpeedLimitAreaState = {
	properties: {
		name: '',
		maxVelocity: 1,
		type: 'speedLimit',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
	},
	bounds: [
		[111, 222],
		[444, 333],
	],
};

const updatedSpeedLimitFeature: SpeedLimitAreaState = {
	properties: {
		name: 'newName',
		maxVelocity: 0.5,
		type: 'speedLimit',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
	},
	bounds: [
		[1, 222],
		[444, 3],
	],
};

describe('Speed Limit Area', () => {
	it('should render a speed limit area inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[speedLimitAreaFeature]} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[speedLimitAreaFeature]} callback={callback} />,
		);
		getByText('Speed Limit');
		getByText(speedLimitAreaFeature.properties.id);

		const elementNameTextField = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementNameTextField.value, '');

		const elementMaxVelocity = getByLabelText('Max Velocity (m/s)') as HTMLTextAreaElement;
		assert.equal(elementMaxVelocity.value, '1');

		getByDisplayValue(String(speedLimitAreaFeature.bounds[0][0]));
		getByDisplayValue(String(speedLimitAreaFeature.bounds[0][1]));
		getByDisplayValue(String(speedLimitAreaFeature.bounds[1][1]));
		getByDisplayValue(String(speedLimitAreaFeature.bounds[1][0]));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String(speedLimitAreaFeature.bounds[0][0])), {
			target: { value: 1 },
		});
		fireEvent.change(getByDisplayValue(String(speedLimitAreaFeature.bounds[1][1])), {
			target: { value: 3 },
		});

		fireEvent.change(getByLabelText('Max Velocity (m/s)'), { target: { value: '0.5' } });

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedSpeedLimitFeature);
	});
});
