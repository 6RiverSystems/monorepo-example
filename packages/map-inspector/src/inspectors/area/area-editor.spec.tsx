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

const impassableAreaFeature: ImpassableAreaState = {
	properties: { name: 'msborder', type: 'impassable', id: '0009cfa9-0df5-44a7-9dd0-531581e73426' },
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const updatedImpassableFeature: ImpassableAreaState = {
	properties: { name: 'newName', type: 'impassable', id: '0009cfa9-0df5-44a7-9dd0-531581e73426' },
	bounds: [
		[111, 6],
		[223, 5],
	],
};

const keepOutAreaFeature: KeepOutAreaState = {
	properties: { name: '', type: 'keepOut', id: '0009cfa9-0df5-44a7-9dd0-531581e73426' },
	bounds: [
		[111, 444],
		[222, 333],
	],
};

const updatedKeepOutFeature: KeepOutAreaState = {
	properties: { name: 'newName', type: 'keepOut', id: '0009cfa9-0df5-44a7-9dd0-531581e73426' },
	bounds: [
		[1, 444],
		[2, 333],
	],
};

const queueAreaFeature: QueueAreaState = {
	properties: {
		name: '',
		type: 'queue',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		queueName: '',
	},
	bounds: [
		[111, 444],
		[222, 333],
	],
};

const updatedQueueFeature: QueueAreaState = {
	properties: {
		name: 'newName',
		type: 'queue',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		queueName: '',
	},
	bounds: [
		[111, 2],
		[3, 333],
	],
};

const stayOnPathAreaFeature: StayOnPathAreaState = {
	properties: {
		name: '',
		type: 'stayOnPath',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
	},
	bounds: [
		[111, 444],
		[222, 333],
	],
};

const updatedStayOnPathFeature: StayOnPathAreaState = {
	properties: {
		name: 'newName',
		type: 'stayOnPath',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
	},
	bounds: [
		[1, 444],
		[222, 5],
	],
};

describe('Impassable Area', () => {
	it('should render an impassable inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[impassableAreaFeature]} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[impassableAreaFeature]} callback={callback} />,
		);
		getByText('Impassable');
		getByText(impassableAreaFeature.properties.id);
		getByDisplayValue('msborder');

		getByDisplayValue(String(impassableAreaFeature.bounds[0][1]));
		getByDisplayValue(String(impassableAreaFeature.bounds[0][0]));
		getByDisplayValue(String(impassableAreaFeature.bounds[1][0]));
		getByDisplayValue(String(impassableAreaFeature.bounds[1][1]));

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String(impassableAreaFeature.bounds[0][1])), {
			target: { value: 6 },
		});
		fireEvent.change(getByDisplayValue(String(impassableAreaFeature.bounds[1][1])), {
			target: { value: 5 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedImpassableFeature);
	});
});

describe('Keepout Area', () => {
	it('should render an keepout inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[keepOutAreaFeature]} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[keepOutAreaFeature]} callback={callback} />,
		);
		getByText('Keep Out');

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String(keepOutAreaFeature.bounds[0][0])), {
			target: { value: 1 },
		});
		fireEvent.change(getByDisplayValue(String(keepOutAreaFeature.bounds[1][0])), {
			target: { value: 2 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedKeepOutFeature);
	});
});

describe('Queue Area', () => {
	it('should render an queue inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[queueAreaFeature]} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[queueAreaFeature]} callback={callback} />,
		);
		getByText('Queue');

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String(queueAreaFeature.bounds[0][1])), {
			target: { value: 2 },
		});
		fireEvent.change(getByDisplayValue(String(queueAreaFeature.bounds[1][0])), {
			target: { value: 3 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedQueueFeature);
	});
});

describe('Stay on Path Area', () => {
	it('should render an stay on path inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[stayOnPathAreaFeature]} />),
		);
	});

	it('should render and update the form fields correctly', async () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[stayOnPathAreaFeature]} callback={callback} />,
		);
		getByText('Stay-On-Path');

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.change(getByDisplayValue(String(stayOnPathAreaFeature.bounds[0][0])), {
			target: { value: 1 },
		});
		fireEvent.change(getByDisplayValue(String(stayOnPathAreaFeature.bounds[1][1])), {
			target: { value: 5 },
		});

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.deepEqual(callbackResult[0], updatedStayOnPathFeature);
	});
});
