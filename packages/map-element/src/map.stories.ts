import { optionsKnob as options } from '@storybook/addon-knobs';
import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';

import { renderEl } from '../../../tools/storybook/common';
import xpomem from '../../../tools/test-fixtures/map-stack/xpomem.json';
import { MapElement } from './element/map-element';

import './element/map-element';
export default { title: 'Map-Element' };

function layerOptionsKnobs() {
	const values = {
		Aisles: 'show-aisle',
		CostAreas: 'show-cost-area',
		KeepOutAreas: 'show-keep-out-area',
		PlaySoundAreas: 'show-play-sound-area',
		QueueAreas: 'show-queue-area',
		StayOnPathAreas: 'show-stay-on-path-area',
		SpeedLimitAreas: 'show-speed-limit-area',
		WeightedAreas: 'show-weighted-area',
		WorkflowPoints: 'show-workflow-point',
	};
	const value = options<any>('Layers', values, Object.values(values), {
		display: 'inline-check',
	});
	const layerAttributes = value.reduce((a, v) => ((a[v] = true), a), {});
	return layerAttributes;
}

export function MapElementWebComponent() {
	const layerAttributes = layerOptionsKnobs();

	const el = renderEl('map-ui') as MapElement;
	el['map-stack'] = xpomem;
	Object.keys(layerAttributes as object).forEach(attrib => (el[attrib] = layerAttributes[attrib]));
	return el;
}
