/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { number, optionsKnob } from '@storybook/addon-knobs';
import '@shopify/polaris/styles.css';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import {
	MapStackData,
	MapStack,
	parse,
	SpeedLimitAreaState,
	AisleState,
	WorkflowPointState,
	WeightedAreaState,
	CostAreaState,
} from '@sixriver/map-io';

import { reactDecorator } from '../../../tools/storybook/react-decorator';
import xpomem from '../../../tools/test-fixtures/map-stack/xpomem.json';
import { MapInspector } from './map-inspector';

const mapStack: MapStackData = parse(xpomem as MapStack);

export default { title: 'MapInspector', decorators: [reactDecorator()] };

const wrapperStyles = css`
	width: 300px;
`;

export function MultiSelect() {
	const stayOnPaths = mapStack.areas.filter(area => area.properties.type === 'stayOnPath');
	const aisles = mapStack.aisles;
	const impassables = mapStack.areas.filter(area => area.properties.type === 'impassable');
	const workflowPoints = mapStack.workflowPoints;

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
			[222, 1],
			[3, 444],
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

	const updatedCostAreaFeature: CostAreaState = {
		properties: {
			name: 'newName',
			cost: 100,
			type: 'costArea',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[222, 1],
			[3, 444],
		],
	};

	const aisleFeature: AisleState = {
		properties: {
			name: '24-south',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'aisle',
			object: 'aisle',
			labels: ['ssss'],
			directed: true,
		},
		points: [
			[3, 11],
			[5, 13],
		],
	};

	const aisleFeature2: AisleState = {
		properties: {
			name: '23-aisle',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
			type: 'aisle',
			object: 'aisle',
			labels: ['hiiiii', 'ssss'],
			directed: true,
		},
		points: [
			[23, 11],
			[10, 13],
		],
	};

	const workflowPointFeature: WorkflowPointState = {
		properties: {
			name: 'home',
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
			labels: ['label1', 'label2'],
			workflowOptions: ['option1'],
		},
		position: [1, 2],
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

	const weightedAreaFeature1: WeightedAreaState = {
		properties: {
			name: '',
			type: 'weightedArea',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73425',
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
			[111, 444],
			[223, 555],
		],
	};

	const features = [
		stayOnPaths[0],
		stayOnPaths[1],
		impassables[3],
		aisleFeature,
		aisleFeature2,
		workflowPoints[0],
		workflowPoints[1],
		workflowPointFeature,
		updatedWorkflowPointFeature,
		weightedAreaFeature,
		weightedAreaFeature1,
		localCostAreaFeature,
		updatedCostAreaFeature,
		speedLimitAreaFeature,
		updatedSpeedLimitFeature,
	];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={features} />
			</AppProvider>
		</div>
	);
}

export function WorkflowPoint() {
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: mapStack.workflowPoints.length - 1,
		range: false,
	});
	const feature = mapStack.workflowPoints[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function Aisle() {
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: mapStack.aisles.length - 1,
		range: false,
	});
	const feature = mapStack.aisles[featureIndex];
	const zoneLabels = ['zone-1', 'zone-2', 'zone-3'];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} zoneLabels={zoneLabels} />
			</AppProvider>
		</div>
	);
}

export function Impassable() {
	const impassables = mapStack.areas.filter(area => area.properties.type === 'impassable');
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: impassables.length - 1,
		range: false,
	});

	const feature = impassables[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function KeepOut() {
	const keepOuts = mapStack.areas.filter(area => area.properties.type === 'keepOut');
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: keepOuts.length - 1,
		range: false,
	});

	const feature = keepOuts[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function LocalCostArea() {
	const localCostAreas = mapStack.areas.filter(area => area.properties.type === 'costArea');
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: localCostAreas.length - 1,
		range: false,
	});

	const feature = localCostAreas[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function WeightedArea() {
	const weightedAreas = mapStack.areas.filter(area => area.properties.type === 'weightedArea');
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: weightedAreas.length - 1,
		range: false,
	});

	const feature = weightedAreas[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function Queue() {
	const queues = mapStack.areas.filter(area => area.properties.type === 'queue');
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: queues.length - 1,
		range: false,
	});

	const feature = queues[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function StayOnPath() {
	const stayOnPaths = mapStack.areas.filter(area => area.properties.type === 'stayOnPath');
	const featureIndex = number('Feature Index', 0, {
		min: 0,
		max: stayOnPaths.length - 1,
		range: false,
	});

	const feature = stayOnPaths[featureIndex];
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[feature]} />
			</AppProvider>
		</div>
	);
}

export function SpeedLimit() {
	const speedLimitAreaFeature: SpeedLimitAreaState = {
		properties: {
			name: 'speed limit',
			maxVelocity: 1.1,
			type: 'speedLimit',
			id: '0009cfa9-0df5-44a7-9dd0-531581e73426',
		},
		bounds: [
			[111, 222],
			[444, 333],
		],
	};
	return (
		<div css={wrapperStyles}>
			<AppProvider i18n={en}>
				<MapInspector features={[speedLimitAreaFeature]} />
			</AppProvider>
		</div>
	);
}
