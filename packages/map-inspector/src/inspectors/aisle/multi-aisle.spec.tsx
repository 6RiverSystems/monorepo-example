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

const aisleFeature2: AisleState = {
	properties: {
		name: '23-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-2'],
		directed: true,
	},
	points: [
		[1, 11],
		[3, 13],
	],
};

const aisleFeature3: AisleState = {
	properties: {
		name: '22-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-2'],
		directed: true,
	},
	points: [
		[2, 11],
		[14, 13],
	],
};

const aisleFeatures = [aisleFeature, aisleFeature2, aisleFeature3];

const aisleFeature4: AisleState = {
	properties: {
		name: '23-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-1'],
		directed: false,
	},
	points: [
		[1, 11],
		[3, 13],
	],
};

const aisleFeature5: AisleState = {
	properties: {
		name: '22-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-2'],
		directed: true,
	},
	points: [
		[2, 11],
		[14, 13],
	],
};

const aisleFeature6: AisleState = {
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

const aisleFeatures2 = [aisleFeature4, aisleFeature5, aisleFeature6];

const aisleFeatures3 = [aisleFeature5, aisleFeature6];

const updatedAisleFeature4: AisleState = {
	properties: {
		name: '23-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-1'],
		directed: true,
	},
	points: [
		[1, 11],
		[3, 13],
	],
};

const updatedAisleFeature5: AisleState = {
	properties: {
		name: '22-south',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
		type: 'aisle',
		object: 'aisle',
		labels: ['zone-2'],
		directed: true,
	},
	points: [
		[2, 11],
		[14, 13],
	],
};

const updatedAisleFeature6: AisleState = {
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

const updatedAisleFeatures2 = [updatedAisleFeature4, updatedAisleFeature5, updatedAisleFeature6];

describe('Multi Aisle', () => {
	it('should render a aisle inspector with multiple features successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={aisleFeatures} />));
	});

	it('should render the form fields correctly', async () => {
		const { getByLabelText, getByText, getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={aisleFeatures} />,
		);

		getAllByText('Aisle');
		getByText('Selected 3 features');

		const elementName = getByLabelText('Name') as HTMLTextAreaElement;
		assert.equal(elementName.value, '');

		const elementDirected = getByLabelText('One Way Aisle') as HTMLInputElement;
		assert.isTrue(elementDirected.checked);

		getByText('zone-2');
		getByText('Swap Direction');

		getByDisplayValue('11');
		getByDisplayValue('13');
	});

	it('should render the form fields correctly', async () => {
		const { getByLabelText, getByText, getAllByText } = renderWithAppProvider(
			<MapInspector features={aisleFeatures2} />,
		);
		getAllByText('Aisle');
		getByText('Selected 3 features');

		const elementDirected = getByLabelText('One Way/ Two Way Aisles') as HTMLInputElement;
		assert.isTrue(elementDirected.checked);

		getByText('Tags vary across selected features');
	});

	it('should change directed property correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByLabelText, getByText, getByRole } = renderWithAppProvider(
			<MapInspector features={aisleFeatures2} callback={callback} />,
		);

		const elementDirected = getByLabelText('One Way/ Two Way Aisles') as HTMLInputElement;
		assert.isTrue(elementDirected.checked);

		fireEvent.click(getByText('One Way Aisle'));
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAisleFeatures2);
		assert.deepEqual(jsonCallback, jsonExpected);
	});

	it('should not change label property', async () => {
		const updatedAisleFeature: AisleState = {
			properties: {
				name: '23-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
				type: 'aisle',
				object: 'aisle',
				labels: ['zone-1'],
				directed: false,
			},
			points: [
				[1, 11],
				[3, 13],
			],
		};

		const updatedAisleFeature1: AisleState = {
			properties: {
				name: '22-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
				type: 'aisle',
				object: 'aisle',
				labels: ['zone-2'],
				directed: true,
			},
			points: [
				[2, 11],
				[14, 13],
			],
		};

		const updatedAisleFeature2: AisleState = {
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

		const updatedAisleFeatures = [updatedAisleFeature, updatedAisleFeature1, updatedAisleFeature2];

		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};

		const { getByLabelText, getByText, getByRole } = renderWithAppProvider(
			<MapInspector features={aisleFeatures2} callback={callback} />,
		);

		const elementLabels = getByLabelText('Zone') as HTMLInputElement;
		assert.equal(elementLabels.value, '');
		getByText('Tags vary across selected features');

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAisleFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});

	it('should clear label property and add tags correctly', async () => {
		const updatedAisleFeature: AisleState = {
			properties: {
				name: '23-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
				type: 'aisle',
				object: 'aisle',
				labels: [],
				directed: false,
			},
			points: [
				[1, 11],
				[3, 13],
			],
		};

		const updatedAisleFeature1: AisleState = {
			properties: {
				name: '22-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
				type: 'aisle',
				object: 'aisle',
				labels: [],
				directed: true,
			},
			points: [
				[2, 11],
				[14, 13],
			],
		};

		const updatedAisleFeature2: AisleState = {
			properties: {
				name: '24-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'aisle',
				object: 'aisle',
				labels: [],
				directed: true,
			},
			points: [
				[23, 11],
				[10, 13],
			],
		};

		const updatedAisleFeatures = [updatedAisleFeature, updatedAisleFeature1, updatedAisleFeature2];

		const updatedAisleFeature3: AisleState = {
			properties: {
				name: '23-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
				type: 'aisle',
				object: 'aisle',
				labels: ['newTag'],
				directed: false,
			},
			points: [
				[1, 11],
				[3, 13],
			],
		};

		const updatedAisleFeature4: AisleState = {
			properties: {
				name: '22-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
				type: 'aisle',
				object: 'aisle',
				labels: ['newTag'],
				directed: true,
			},
			points: [
				[2, 11],
				[14, 13],
			],
		};

		const updatedAisleFeature5: AisleState = {
			properties: {
				name: '24-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'aisle',
				object: 'aisle',
				labels: ['newTag'],
				directed: true,
			},
			points: [
				[23, 11],
				[10, 13],
			],
		};

		const updatedAisleFeatures2 = [
			updatedAisleFeature3,
			updatedAisleFeature4,
			updatedAisleFeature5,
		];

		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};

		const { getByLabelText, getByText, getByRole } = renderWithAppProvider(
			<MapInspector features={aisleFeatures2} callback={callback} />,
		);

		fireEvent.click(getByText('Clear tags'));

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAisleFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);

		fireEvent.change(getByLabelText('Zone'), { target: { value: 'newTag ' } });
		getByText('newTag');

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback2 = JSON.stringify(callbackResult);
		const jsonExpected2 = JSON.stringify(updatedAisleFeatures2);
		assert.deepEqual(jsonCallback2, jsonExpected2);
	});

	it('should swap line coordinate fields correctly', async () => {
		const aisleFeature5: AisleState = {
			properties: {
				name: '22-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
				type: 'aisle',
				object: 'aisle',
				labels: ['zone-2'],
				directed: true,
			},
			points: [
				[2, 11],
				[14, 13],
			],
		};

		const aisleFeature6: AisleState = {
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

		const aisleFeatures = [aisleFeature5, aisleFeature6];

		const updatedAisleFeature5: AisleState = {
			properties: {
				name: '22-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73424',
				type: 'aisle',
				object: 'aisle',
				labels: ['zone-2'],
				directed: true,
			},
			points: [
				[14, 13],
				[2, 11],
			],
		};

		const updatedAisleFeature6: AisleState = {
			properties: {
				name: '24-south',
				id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
				type: 'aisle',
				object: 'aisle',
				labels: ['zone-2'],
				directed: true,
			},
			points: [
				[10, 13],
				[23, 11],
			],
		};

		const updatedAisleFeatures = [updatedAisleFeature5, updatedAisleFeature6];
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByRole, getByText } = renderWithAppProvider(
			<MapInspector features={aisleFeatures} callback={callback} />,
		);

		fireEvent.click(getByText('Swap Direction'));

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAisleFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});
