import React from 'react';
import { AisleState, WorkflowPointState, AreasState } from '@sixriver/map-io';

import {
	AisleEditor,
	WorkflowPointEditor,
	LocalCostAreaEditor,
	WeightedAreaEditor,
	SpeedLimitAreaEditor,
	AreaEditor,
} from './inspectors';

type Feature = WorkflowPointState | AisleState | AreasState;
interface FeatureEditorProps {
	features?: Feature[];
}
/**
 * Renders a dynamic form based on a map feature or a collection of features based on the feature's type
 */
export function FeatureEditor({ features }: FeatureEditorProps) {
	const feature = features && features.length && features[0];

	switch (feature.properties.type) {
		case 'aisle':
			return <AisleEditor key={feature.properties.id} />;
		case 'workflowPoint':
			return <WorkflowPointEditor key={feature.properties.id} />;
		case 'costArea':
			return <LocalCostAreaEditor key={feature.properties.id} />;
		case 'weightedArea':
			return <WeightedAreaEditor key={feature.properties.id} />;
		case 'speedLimit':
			return <SpeedLimitAreaEditor key={feature.properties.id} />;
		case 'keepOut':
		case 'impassable':
		case 'stayOnPath':
		case 'queue':
			return <AreaEditor key={feature.properties.id} />;
	}
}
