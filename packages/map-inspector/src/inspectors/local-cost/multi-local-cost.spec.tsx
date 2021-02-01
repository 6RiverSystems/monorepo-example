import { assert } from 'chai';
import React from 'react';
import { CostAreaState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

describe('Multi Local Cost Area', () => {
	const AreaFeature: CostAreaState = {
		properties: {
			name: 'msborder',
			type: 'costArea',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			cost: 100,
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const AreaFeature1: CostAreaState = {
		properties: {
			name: '',
			type: 'costArea',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			cost: 100,
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const AreaFeatures = [AreaFeature, AreaFeature1];

	const updatedAreaFeature: CostAreaState = {
		properties: {
			name: 'msborder',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'costArea',
			cost: 6,
		},
		bounds: [
			[6, 222],
			[223, 333],
		],
	};

	const updatedAreaFeature1: CostAreaState = {
		properties: {
			name: '',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'costArea',
			cost: 6,
		},
		bounds: [
			[6, 444],
			[223, 555],
		],
	};

	const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];
	it('should render an local cost area inspector successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={AreaFeatures} />));
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getAllByText,
			queryByText,
			getByLabelText,
			getByDisplayValue,
			getByRole,
		} = renderWithAppProvider(<MapInspector features={AreaFeatures} callback={callback} />);
		getAllByText('Local Cost Area');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		getByDisplayValue(String('100'));
		assert.isNull(queryByText('333'));
		assert.isNull(queryByText('msborder'));

		fireEvent.change(getByDisplayValue(String('111')), {
			target: { value: '6' },
		});

		fireEvent.change(getByLabelText('Cost'), {
			target: { value: '6' },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});

	it('should render and update the cost fields correctly', async () => {
		const AreaFeature: CostAreaState = {
			properties: {
				name: 'msborder',
				type: 'costArea',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				cost: 50,
			},
			bounds: [
				[111, 222],
				[223, 333],
			],
		};

		const AreaFeature1: CostAreaState = {
			properties: {
				name: '',
				type: 'costArea',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				cost: 100,
			},
			bounds: [
				[111, 444],
				[223, 555],
			],
		};

		const AreaFeatures = [AreaFeature, AreaFeature1];

		const updatedAreaFeature: CostAreaState = {
			properties: {
				name: 'msborder',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'costArea',
				cost: 6,
			},
			bounds: [
				[111, 222],
				[223, 333],
			],
		};

		const updatedAreaFeature1: CostAreaState = {
			properties: {
				name: '',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'costArea',
				cost: 6,
			},
			bounds: [
				[111, 444],
				[223, 555],
			],
		};
		const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];

		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByLabelText, getByRole } = renderWithAppProvider(
			<MapInspector features={AreaFeatures} callback={callback} />,
		);
		fireEvent.change(getByLabelText('Cost'), {
			target: { value: '6' },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});
