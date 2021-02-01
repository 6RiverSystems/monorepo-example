import { assert } from 'chai';
import React from 'react';
import { WeightedAreaState } from '@sixriver/map-io';
import { renderWithAppProvider } from '../render-app-provider';
import { MapInspector } from '../../map-inspector';

const weightedAreaFeatureNorth: WeightedAreaState = {
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

const weightedAreaFeatureSouth: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 0,
		ne: 0,
		nw: 0,
		s: 10,
		se: 10,
		sw: 10,
		e: 0,
		w: 0,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const weightedAreaFeatureAllDirections: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 10,
		ne: 10,
		nw: 10,
		s: 10,
		se: 10,
		sw: 10,
		e: 10,
		w: 10,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const weightedAreaFeatureEast: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 0,
		ne: 200,
		nw: 0,
		s: 0,
		se: 200,
		sw: 0,
		e: 200,
		w: 0,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const weightedAreaFeatureWest: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 0,
		ne: 0,
		nw: 200,
		s: 0,
		se: 0,
		sw: 200,
		e: 0,
		w: 200,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const weightedAreaFeatureManual1: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 0,
		ne: 199,
		nw: 0,
		s: 0,
		se: 200,
		sw: 0,
		e: 200,
		w: 0,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

const weightedAreaFeatureManual2: WeightedAreaState = {
	properties: {
		name: '',
		type: 'weightedArea',
		id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		n: 23,
		ne: 200,
		nw: 11,
		s: 3,
		se: 200,
		sw: 4,
		e: 200,
		w: 6,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
};

describe('Weighted Area Auto', () => {
	it('should render a auto editor inspector successfully', () => {
		assert.doesNotThrow(() =>
			renderWithAppProvider(<MapInspector features={[weightedAreaFeatureNorth]} />),
		);
	});

	it('should render the form fields correctly for north weighted area', async () => {
		const { getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureNorth]} />,
		);
		getAllByText('north');
		getByDisplayValue('200');
	});

	it('should render the form fields correctly for south weighted area', async () => {
		const { getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureSouth]} />,
		);
		getAllByText('south');
		getByDisplayValue('10');
	});

	it('should render the form fields correctly for east weighted area', async () => {
		const { getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureEast]} />,
		);
		getAllByText('east');
		getByDisplayValue('200');
	});

	it('should render the form fields correctly for west weighted area', async () => {
		const { getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureWest]} />,
		);
		getAllByText('west');
		getByDisplayValue('200');
	});

	it('should render the form fields correctly for equally weighted area', async () => {
		const { getByDisplayValue, getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureAllDirections]} />,
		);
		getAllByText('all directions');
		getByDisplayValue('10');
	});

	it('should render the form fields correctly for manual weighted area', async () => {
		const { getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureManual1]} />,
		);
		getAllByText('manual');
	});

	it('should render the form fields correctly for manual weighted area', async () => {
		const { getAllByText } = renderWithAppProvider(
			<MapInspector features={[weightedAreaFeatureManual2]} />,
		);
		getAllByText('manual');
	});
});
