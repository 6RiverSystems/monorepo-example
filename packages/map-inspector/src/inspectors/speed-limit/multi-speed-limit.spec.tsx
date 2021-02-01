import { assert } from 'chai';
import React from 'react';
import { SpeedLimitAreaState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

describe('Multi Speed Limit Area', () => {
	const AreaFeature: SpeedLimitAreaState = {
		properties: {
			name: 'msborder',
			type: 'speedLimit',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			maxVelocity: 1.3,
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const AreaFeature1: SpeedLimitAreaState = {
		properties: {
			name: '',
			type: 'speedLimit',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			maxVelocity: 1.3,
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const AreaFeatures = [AreaFeature, AreaFeature1];

	const updatedAreaFeature: SpeedLimitAreaState = {
		properties: {
			name: 'msborder',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'speedLimit',
			maxVelocity: 0.5,
		},
		bounds: [
			[6, 222],
			[223, 333],
		],
	};

	const updatedAreaFeature1: SpeedLimitAreaState = {
		properties: {
			name: '',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'speedLimit',
			maxVelocity: 0.5,
		},
		bounds: [
			[6, 444],
			[223, 555],
		],
	};

	const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];
	it('should render a speed limit inspector successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={AreaFeatures} />));
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			queryByText,
			getByLabelText,
			getByDisplayValue,
			getByRole,
		} = renderWithAppProvider(<MapInspector features={AreaFeatures} callback={callback} />);
		getByText('Speed Limit');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		getByDisplayValue(String('1.3'));
		assert.isNull(queryByText('333'));
		assert.isNull(queryByText('msborder'));

		fireEvent.change(getByDisplayValue(String('111')), {
			target: { value: '6' },
		});

		fireEvent.change(getByLabelText('Max Velocity (m/s)'), {
			target: { value: '.5' },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});

	it('should render and update the maxVelocity fields correctly', async () => {
		const AreaFeature: SpeedLimitAreaState = {
			properties: {
				name: 'msborder',
				type: 'speedLimit',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				maxVelocity: 0.5,
			},
			bounds: [
				[111, 222],
				[223, 333],
			],
		};

		const AreaFeature1: SpeedLimitAreaState = {
			properties: {
				name: '',
				type: 'speedLimit',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				maxVelocity: 1.3,
			},
			bounds: [
				[111, 444],
				[223, 555],
			],
		};

		const AreaFeatures = [AreaFeature, AreaFeature1];

		const updatedAreaFeature: SpeedLimitAreaState = {
			properties: {
				name: 'msborder',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'speedLimit',
				maxVelocity: 0.5,
			},
			bounds: [
				[111, 222],
				[223, 333],
			],
		};

		const updatedAreaFeature1: SpeedLimitAreaState = {
			properties: {
				name: '',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'speedLimit',
				maxVelocity: 1.3,
			},
			bounds: [
				[111, 444],
				[223, 555],
			],
		};
		const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];

		const updatedAreaFeature2: SpeedLimitAreaState = {
			properties: {
				name: 'msborder',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'speedLimit',
				maxVelocity: 0.5,
			},
			bounds: [
				[111, 222],
				[223, 333],
			],
		};

		const updatedAreaFeature3: SpeedLimitAreaState = {
			properties: {
				name: '',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'speedLimit',
				maxVelocity: 0.5,
			},
			bounds: [
				[111, 444],
				[223, 555],
			],
		};
		const updatedAreaFeatures2 = [updatedAreaFeature2, updatedAreaFeature3];

		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByLabelText, getByRole } = renderWithAppProvider(
			<MapInspector features={AreaFeatures} callback={callback} />,
		);

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);

		fireEvent.change(getByLabelText('Max Velocity (m/s)'), {
			target: { value: '.5' },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback2 = JSON.stringify(callbackResult);
		const jsonExpected2 = JSON.stringify(updatedAreaFeatures2);
		assert.deepEqual(jsonCallback2, jsonExpected2);
	});
});
