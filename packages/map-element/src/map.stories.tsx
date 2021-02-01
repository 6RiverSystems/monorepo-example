import React from 'react';
import { number, optionsKnob as options, object, select } from '@storybook/addon-knobs';

import { reactDecorator } from '../../../tools/storybook/react-decorator';
import xpomem from '../../../tools/test-fixtures/map-stack/xpomem.json';
import actfon from '../../../tools/test-fixtures/map-stack/actfon.json';
import simulationTorr from '../../../tools/test-fixtures/map-stack/simulation-torr.json';
import staging271 from '../../../tools/test-fixtures/map-stack/staging271.json';
import map from '../../../tools/test-fixtures/map-stack/map.json';
import coordinatesTest from '../../../tools/test-fixtures/map-stack/coordinates-test.json';
import { Map } from './map';
import { Chuck } from './chuck';
import { Goal } from './goal';
import { Path } from './path';
import { unscale, scaleMin, scaleMax, noopScale } from './map/view';

export default { title: 'Map-Component', decorators: [reactDecorator()] };

function layerOptionsKnobs() {
	const values = {
		Aisles: 'showAisle',
		CostAreas: 'showCostArea',
		KeepOutAreas: 'showKeepOutArea',
		PlaySoundAreas: 'showPlaySoundArea',
		QueueAreas: 'showQueueArea',
		StayOnPathAreas: 'showStayOnPathArea',
		SpeedLimitAreas: 'showSpeedLimitArea',
		WeightedAreas: 'showWeightedArea',
		WorkflowPoints: 'showWorkflowPoint',
	};
	const value = options<any>('Layers', values, Object.values(values), {
		display: 'inline-check',
	});
	const layerAttributes = value.reduce((a, v) => ((a[v] = true), a), {});
	return layerAttributes;
}

function mapOptionsKnob(defaultMap = 'xpomem') {
	const mapName = options<string>(
		'Map',
		{
			Development: 'map',
			Test: 'coordinatesTest',
			Xpomem: 'xpomem',
			Actfon: 'actfon',
			'Simulation-Torr': 'simulationTorr',
			'Staging 271': 'staging271',
		},
		defaultMap,
		{
			display: 'select',
		},
	);
	return { map, coordinatesTest, xpomem, actfon, simulationTorr, staging271 }[mapName];
}

export function MapComponent() {
	const mapStack = mapOptionsKnob();
	const layerAttributes = layerOptionsKnobs();

	const scale = number('scale', 1, { min: 0.25, max: 4, range: true, step: 0.1 });
	const x = number('X', 0, { min: -300, max: 300, range: true });
	const y = number('y', 0, { min: -300, max: 300, range: true });
	return (
		<Map
			enablePanControl
			enableZoomControl
			enableSelectionControl
			mapStack={mapStack}
			zoom={{ scale, translate: { y, x } }}
			{...layerAttributes}
		/>
	);
}

export function TestMap() {
	const scale = select<number>('scale', [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4, 5, 10], 1);
	const orientation = number('orientation', 0, { min: 0, max: 360, range: true, step: 1 });
	const x = number('X', 0, { min: -300, max: 300, range: true });
	const y = number('y', 0, { min: -300, max: 300, range: true });
	return (
		<Map
			enablePanControl
			enableZoomControl
			enableSelectionControl
			mapStack={coordinatesTest as any}
			zoom={{ scale, translate: { y, x } }}
			showWorkflowPoint={true}
			showCostArea={true}
			showAisle={true}
		>
			<Goal x={0} y={0} orientation={orientation} scalingFn={unscale} />
			<Chuck x={3} y={3} orientation={orientation - 45} scalingFn={noopScale} name="noopScale" />
			<Chuck x={-3} y={3} orientation={orientation + 45} scalingFn={scaleMin} name="scaleMin" />
			<Chuck x={3} y={-3} orientation={orientation + 225} scalingFn={unscale} name="unscale" />
			<Chuck x={-3} y={-3} orientation={orientation + 135} scalingFn={scaleMax} name="scaleMax" />
		</Map>
	);
}
export function MapWithMarkersAndPaths() {
	const mapStack = mapOptionsKnob('map');

	const x = number('X', 10);
	const y = number('y', 5);
	const orientation = number('orientation', 90, { min: 0, max: 360, range: true, step: 1 });
	const zoom = object('zoom rect', {
		x1: -10,
		y1: -10,
		x2: 29.45,
		y2: 22.95,
	});
	const path = object('path', [
		[1, 1],
		[1, 8.5],
		[18, 8.5],
		[18, 5.5],
		[10, 5.5],
	]);
	return (
		<Map
			enablePanControl
			enableZoomControl
			enableSelectionControl
			mapStack={mapStack}
			showWorkflowPoint
			showAisle
			zoom={zoom}
		>
			<Path vertices={path} scaling-function={scaleMin} />
			<Goal x={1} y={1} orientation={orientation} scalingFn={scaleMin} />
			<Chuck x={x} y={y} orientation={orientation} scalingFn={scaleMin} />
		</Map>
	);
}
