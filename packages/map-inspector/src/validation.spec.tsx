import {
	AisleState,
	CostAreaState,
	QueueAreaState,
	SpeedLimitAreaState,
	WeightedAreaState,
	WorkflowPointState,
} from '@sixriver/map-io';
import { fireEvent } from '@testing-library/react';
import { assert } from 'chai';
import React from 'react';
import { renderWithAppProvider } from './inspectors/render-app-provider';
import { MapInspector, MapInspectorProps } from './map-inspector';

const aisleFeature: AisleState = {
	properties: {
		name: '',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		type: 'aisle',
		object: 'aisle',
		labels: ['dog'],
		directed: true,
	},
	points: [
		[3, 11],
		[5, 13],
	],
};

const aisleFeature2: AisleState = {
	properties: {
		name: '',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		type: 'aisle',
		object: 'aisle',
		labels: [],
		directed: true,
	},
	points: [
		[3, 11],
		[5, 13],
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

const localCostAreaFeature: CostAreaState = {
	properties: {
		name: '',
		cost: 200,
		type: 'costArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
	},
	bounds: [
		[111, 222],
		[444, 333],
	],
};

const localCostAreaFeature2: CostAreaState = {
	properties: {
		name: '',
		cost: 180,
		type: 'costArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
	},
	bounds: [
		[111, 222],
		[444, 333],
	],
};

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

const speedLimitAreaFeature2: SpeedLimitAreaState = {
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

const weightedAreaFeature: WeightedAreaState = {
	properties: {
		name: 'msborder',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
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
		[111, 222],
		[223, 333],
	],
};

const weightedAreaFeatureManual: WeightedAreaState = {
	properties: {
		name: 'msborder',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 1,
		ne: 0,
		nw: 0,
		s: 100,
		se: 100,
		sw: 100,
		e: 0,
		w: 0,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const workflowPointFeature: WorkflowPointState = {
	properties: {
		name: '',
		type: 'workflowPoint',
		target: 'generic',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 270,
		labels: ['label1', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [1, 11],
};

const updatedWorkflowPointFeature: WorkflowPointState = {
	properties: {
		name: 'newName',
		target: 'induct',
		type: 'workflowPoint',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		object: 'vertex',
		orientation: 270,
		labels: ['dog', 'label2'],
		workflowOptions: ['option1'],
	},
	position: [1, 2],
};

const localCostAreas = [localCostAreaFeature, localCostAreaFeature2];
const speedLimitAreas = [speedLimitAreaFeature, speedLimitAreaFeature2];
const weightedAreas = [weightedAreaFeature, weightedAreaFeatureManual];

describe('Validation', () => {
	it('should show a validation error if aisle has no name', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector
				features={[aisleFeature]}
				callback={callback}
				zoneLabels={['zone-1', 'zone-2']}
			/>,
		);

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Name is required');
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.notDeepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if queue has no name', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={[queueAreaFeature]} callback={callback} />,
		);

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Name is required');
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.notDeepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if local cost area has no cost and cost is out of bound', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={[localCostAreaFeature]} callback={callback} />,
		);
		fireEvent.change(getByLabelText('Cost'), { target: { value: '' } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Cost is required');
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('Cost'), { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 1 and 250');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if speed limit area max velocity is out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={[speedLimitAreaFeature]} callback={callback} />,
		);
		fireEvent.change(getByLabelText('Max Velocity (m/s)'), { target: { value: '' } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Max velocity is required');
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('Max Velocity (m/s)'), { target: { value: 2 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 0.1 and 1.3');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if auto weighted area cost is out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeature]} callback={callback} />,
		);
		fireEvent.change(getByLabelText('Cost'), { target: { value: '' } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Cost is required');
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('Cost'), { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 1 and 250');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if manual weighted area cost is out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getAllByLabelText,
			getAllByText,
			getByRole,
			getByLabelText,
		} = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureManual]} callback={callback} />,
		);
		fireEvent.change(getByLabelText('North'), { target: { value: '' } });
		fireEvent.change(getByLabelText('East'), { target: { value: '' } });
		fireEvent.change(getByLabelText('West'), { target: { value: '' } });
		fireEvent.change(getByLabelText('South'), { target: { value: '' } });
		fireEvent.change(getByLabelText('South East'), { target: { value: '' } });
		fireEvent.change(getByLabelText('North West'), { target: { value: '' } });
		fireEvent.change(getAllByLabelText('North East')[0], { target: { value: '' } });
		fireEvent.change(getAllByLabelText('South West')[0], { target: { value: '' } });

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.equal(getAllByText('Cost is required').length, 8);
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('North'), { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 0 to 250');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if manual weighted area cost is out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getAllByLabelText,
			getAllByText,
			getByRole,
			getByLabelText,
		} = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureManual]} callback={callback} />,
		);
		fireEvent.change(getByLabelText('North'), { target: { value: '' } });
		fireEvent.change(getByLabelText('East'), { target: { value: '' } });
		fireEvent.change(getByLabelText('West'), { target: { value: '' } });
		fireEvent.change(getByLabelText('South'), { target: { value: '' } });
		fireEvent.change(getByLabelText('South East'), { target: { value: '' } });
		fireEvent.change(getByLabelText('North West'), { target: { value: '' } });
		fireEvent.change(getAllByLabelText('North East')[0], { target: { value: '' } });
		fireEvent.change(getAllByLabelText('South West')[0], { target: { value: '' } });

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.equal(getAllByText('Cost is required').length, 8);
		assert.deepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('North'), { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 0 to 250');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if workflow point name doesnt exist', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole } = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Name is required');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if workflow point orientation is out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={[workflowPointFeature]} callback={callback} />,
		);

		fireEvent.change(getByLabelText('Orientation (degrees)'), { target: { value: '' } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Orientation is required');
		assert.deepEqual(callbackResult[0], undefined);
		fireEvent.change(getByLabelText('Orientation (degrees)'), { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 0 to 360');
		assert.deepEqual(callbackResult[0], undefined);
	});

	it('should show a validation error if multi local cost area has cost out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={localCostAreas} callback={callback} />,
		);
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.notDeepEqual(callbackResult, undefined);

		fireEvent.change(getByLabelText('Cost'), { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 1 and 250');
	});

	it('should show a validation error if multi speed limit area has velocity out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByText, getByRole, getByLabelText } = renderWithAppProvider(
			<MapInspector features={speedLimitAreas} callback={callback} />,
		);
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.notDeepEqual(callbackResult, undefined);

		fireEvent.change(getByLabelText('Max Velocity (m/s)'), { target: { value: 2 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		getByText('Enter a value between 0.1 and 1.3');
	});

	it('should show a validation error if multi weighted area cost is out of bounds', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const {
			getByText,
			getAllByLabelText,
			getAllByText,
			getByRole,
			getByLabelText,
		} = renderWithAppProvider(<MapInspector features={weightedAreas} callback={callback} />);

		fireEvent.change(getByLabelText('North'), { target: { value: '' } });
		fireEvent.change(getByLabelText('East'), { target: { value: '' } });
		fireEvent.change(getByLabelText('West'), { target: { value: '' } });
		fireEvent.change(getByLabelText('South'), { target: { value: '' } });
		fireEvent.change(getByLabelText('South East'), { target: { value: '' } });
		fireEvent.change(getByLabelText('North West'), { target: { value: '' } });
		fireEvent.change(getAllByLabelText('North East')[0], { target: { value: '' } });
		fireEvent.change(getAllByLabelText('South West')[0], { target: { value: '' } });

		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.notDeepEqual(callbackResult[0], undefined);

		fireEvent.change(getByLabelText('North'), { target: { value: 400 } });
		fireEvent.change(getByLabelText('East'), { target: { value: 400 } });
		fireEvent.change(getByLabelText('West'), { target: { value: 400 } });
		fireEvent.change(getByLabelText('South'), { target: { value: 400 } });
		fireEvent.change(getByLabelText('South East'), { target: { value: 400 } });
		fireEvent.change(getByLabelText('North West'), { target: { value: 400 } });
		fireEvent.change(getAllByLabelText('North East')[0], { target: { value: 400 } });
		fireEvent.change(getAllByLabelText('South West')[0], { target: { value: 400 } });
		fireEvent.click(getByRole('button', { name: 'Submit' }));
		assert.equal(getAllByText('Enter a value between 0 to 250').length, 8);
	});
});
