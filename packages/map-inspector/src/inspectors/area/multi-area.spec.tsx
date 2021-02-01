import { assert } from 'chai';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
	ImpassableAreaState,
	KeepOutAreaState,
	QueueAreaState,
	StayOnPathAreaState,
} from '@sixriver/map-io';

import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector, MapInspectorProps } from '../../map-inspector';

describe('Multi Impassable Area', () => {
	const impassableAreaFeature: ImpassableAreaState = {
		properties: {
			name: 'msborder',
			type: 'impassable',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const impassableAreaFeature1: ImpassableAreaState = {
		properties: {
			name: 'msborder',
			type: 'impassable',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const impassableAreaFeatures = [impassableAreaFeature, impassableAreaFeature1];

	const updatedImpassableAreaFeature: ImpassableAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'impassable',
		},
		bounds: [
			[6, 222],
			[223, 333],
		],
	};

	const updatedImpassableAreaFeature1: ImpassableAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'impassable',
		},
		bounds: [
			[6, 444],
			[223, 555],
		],
	};

	const updatedImpassableAreaFeatures = [
		updatedImpassableAreaFeature,
		updatedImpassableAreaFeature1,
	];
	it('should render an impassable inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={impassableAreaFeatures} />),
		);
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
		} = renderWithAppProvider(
			<MapInspector features={impassableAreaFeatures} callback={callback} />,
		);
		getByText('Impassable');
		getByDisplayValue('msborder');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		assert.isNull(queryByText('333'));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String('111')), {
			target: { value: '6' },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedImpassableAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});

describe('Multi Keepout Area', () => {
	const keepOutAreaFeature: KeepOutAreaState = {
		properties: {
			name: 'msborder',
			type: 'keepOut',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const keepOutAreaFeature1: KeepOutAreaState = {
		properties: {
			name: 'msborder',
			type: 'keepOut',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const keepOutAreaFeatures = [keepOutAreaFeature, keepOutAreaFeature1];

	const updatedKeepOutAreaFeature: KeepOutAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'keepOut',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const updatedKeepOutAreaFeature1: KeepOutAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'keepOut',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const updatedKeepOutAreaFeatures = [updatedKeepOutAreaFeature, updatedKeepOutAreaFeature1];

	it('should render an keepout inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={keepOutAreaFeatures} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getByLabelText,
			queryByText,
			getByDisplayValue,
			getByRole,
		} = renderWithAppProvider(<MapInspector features={keepOutAreaFeatures} callback={callback} />);
		getByText('Keep Out');
		getByDisplayValue('msborder');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		assert.isNull(queryByText('333'));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedKeepOutAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});

describe('Multi Queue Area', () => {
	const queueAreaFeature: QueueAreaState = {
		properties: {
			name: 'msborder',
			type: 'queue',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			queueName: '',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const queueAreaFeature1: QueueAreaState = {
		properties: {
			name: 'msborder',
			type: 'queue',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			queueName: '',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const queueAreaFeatures = [queueAreaFeature, queueAreaFeature1];

	const updatedQueueAreaFeature: QueueAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'queue',
			queueName: '',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const updatedQueueAreaFeature1: QueueAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'queue',
			queueName: '',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const updatedQueueAreaFeatures = [updatedQueueAreaFeature, updatedQueueAreaFeature1];
	it('should render an queue inspector successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={queueAreaFeatures} />));
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getByLabelText,
			getByDisplayValue,
			getByRole,
			queryByText,
		} = renderWithAppProvider(<MapInspector features={queueAreaFeatures} callback={callback} />);
		getByText('Queue');
		getByDisplayValue('msborder');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		assert.isNull(queryByText('333'));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedQueueAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});

describe('Multi StayOnPath Area', () => {
	const AreaFeature: StayOnPathAreaState = {
		properties: {
			name: 'msborder',
			type: 'stayOnPath',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const AreaFeature1: StayOnPathAreaState = {
		properties: {
			name: 'msborder',
			type: 'stayOnPath',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const AreaFeatures = [AreaFeature, AreaFeature1];

	const updatedAreaFeature: StayOnPathAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'stayOnPath',
		},
		bounds: [
			[111, 222],
			[223, 333],
		],
	};

	const updatedAreaFeature1: StayOnPathAreaState = {
		properties: {
			name: 'newName',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'stayOnPath',
		},
		bounds: [
			[111, 444],
			[223, 555],
		],
	};

	const updatedAreaFeatures = [updatedAreaFeature, updatedAreaFeature1];
	it('should render an stay on path inspector successfully', () => {
		assert.doesNotThrow(() => renderWithAppProvider(<MapInspector features={AreaFeatures} />));
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getByLabelText,
			getByDisplayValue,
			getByRole,
			queryByText,
		} = renderWithAppProvider(<MapInspector features={AreaFeatures} callback={callback} />);
		getByText('Stay-On-Path');
		getByDisplayValue('msborder');
		getByText('Selected 2 features');

		getByDisplayValue(String('111'));
		getByDisplayValue(String('223'));
		assert.isNull(queryByText('333'));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		const jsonCallback = JSON.stringify(callbackResult);
		const jsonExpected = JSON.stringify(updatedAreaFeatures);
		assert.deepEqual(jsonCallback, jsonExpected);
	});
});
