import { assert } from 'chai';
import React from 'react';
import { WeightedAreaState } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

describe('Multi Weighted Area', () => {
	const AreaFeature: WeightedAreaState = {
		properties: {
			name: 'msborder',
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
			[222, 111],
			[333, 223],
		],
	};

	const AreaFeature1: WeightedAreaState = {
		properties: {
			name: '',
			type: 'weightedArea',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
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
			[444, 111],
			[555, 223],
		],
	};

	const AreaFeatures = [AreaFeature, AreaFeature1];

	const updatedAreaFeature: WeightedAreaState = {
		properties: {
			name: 'msborder',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'weightedArea',
			n: 100,
			ne: 100,
			nw: 100,
			s: 0,
			sw: 0,
			se: 0,
			e: 0,
			w: 0,
		},
		bounds: [
			[222, 6],
			[333, 223],
		],
	};

	const updatedAreaFeature1: WeightedAreaState = {
		properties: {
			name: '',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
			type: 'weightedArea',
			n: 100,
			ne: 100,
			nw: 100,
			s: 0,
			sw: 0,
			se: 0,
			e: 0,
			w: 0,
		},
		bounds: [
			[444, 6],
			[555, 223],
		],
	};

	const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];

	it('should render a weighted area inspector successfully', () => {
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
		getByText('Weighted Area');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		assert.isNull(queryByText('333'));
		assert.isNull(queryByText('msborder'));

		fireEvent.change(getByDisplayValue(String('111')), {
			target: { value: '6' },
		});

		fireEvent.change(getByLabelText('Cost'), {
			target: { value: '100' },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});

	it('should render and update the cost fields correctly', async () => {
		const AreaFeature: WeightedAreaState = {
			properties: {
				name: 'msborder',
				type: 'weightedArea',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				n: 200,
				ne: 200,
				nw: 200,
				s: 0,
				sw: 0,
				se: 0,
				e: 0,
				w: 0,
			},
			bounds: [
				[222, 111],
				[333, 223],
			],
		};

		const AreaFeature1: WeightedAreaState = {
			properties: {
				name: '',
				type: 'weightedArea',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
				n: 0,
				ne: 0,
				nw: 0,
				s: 100,
				se: 100,
				sw: 100,
				e: 0,
				w: 0,
			},
			bounds: [
				[444, 111],
				[555, 223],
			],
		};

		const AreaFeatures = [AreaFeature, AreaFeature1];

		const updatedAreaFeature: WeightedAreaState = {
			properties: {
				name: 'msborder',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'weightedArea',
				n: 200,
				ne: 200,
				nw: 200,
				s: 0,
				sw: 0,
				se: 0,
				e: 0,
				w: 0,
			},
			bounds: [
				[222, 111],
				[333, 223],
			],
		};

		const updatedAreaFeature1: WeightedAreaState = {
			properties: {
				name: '',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
				type: 'weightedArea',
				n: 0,
				ne: 0,
				nw: 0,
				s: 100,
				sw: 100,
				se: 100,
				e: 0,
				w: 0,
			},
			bounds: [
				[444, 111],
				[555, 223],
			],
		};

		const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];

		const updatedAreaFeature2: WeightedAreaState = {
			properties: {
				name: 'msborder',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'weightedArea',
				n: 5,
				ne: 200,
				nw: 200,
				s: 0,
				sw: 0,
				se: 0,
				e: 5,
				w: 0,
			},
			bounds: [
				[222, 111],
				[333, 223],
			],
		};

		const updatedAreaFeature3: WeightedAreaState = {
			properties: {
				name: '',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
				type: 'weightedArea',
				n: 5,
				ne: 0,
				nw: 0,
				s: 100,
				sw: 100,
				se: 100,
				e: 5,
				w: 0,
			},
			bounds: [
				[444, 111],
				[555, 223],
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

		fireEvent.change(getByLabelText('North'), {
			target: { value: 5 },
		});
		fireEvent.change(getByLabelText('East'), {
			target: { value: 5 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback2 = JSON.stringify(callbackResult);
		const jsonExpected2 = JSON.stringify(updatedAreaFeatures2);
		assert.deepEqual(jsonCallback2, jsonExpected2);
	});
});
