import { Feature } from '@sixriver/map-inspector';

import { layerToFeature } from './layerToFeature';
import { featureToLayer } from './featureToLayer';
import {
	makeWorkflowPointFeature,
	makeAisleFeature,
	makeCostAreaFeature,
	makeImpassableAreaFeature,
	makeKeepOutAreaFeature,
	makeQueueAreaFeature,
	makeSpeedLimitAreaFeature,
	makeStayOnPathAreaFeature,
	makeWeightedAreaFeature,
} from '../../../../../../tools/test-fixtures/features';

function verifyFeature(feature: Feature) {
	const layer = featureToLayer(feature);
	const outFeature = layerToFeature(layer);
	expect(feature).toEqual(outFeature);
}

describe('layerToFeature', () => {
	it('should convert an aisle', () => {
		verifyFeature(makeAisleFeature());
	});

	it('should convert a workflowPoint', () => {
		verifyFeature(makeWorkflowPointFeature());
	});

	it('should convert an impassable area', () => {
		verifyFeature(makeWorkflowPointFeature());
	});

	it('should convert a costArea', () => {
		verifyFeature(makeCostAreaFeature());
	});
	it('should convert a impassable', () => {
		verifyFeature(makeImpassableAreaFeature());
	});
	it('should convert a keepOut', () => {
		verifyFeature(makeKeepOutAreaFeature());
	});
	it('should convert a queue', () => {
		verifyFeature(makeQueueAreaFeature());
	});
	it('should convert a speedLimit', () => {
		verifyFeature(makeSpeedLimitAreaFeature());
	});
	it('should convert a stayOnPath', () => {
		verifyFeature(makeStayOnPathAreaFeature());
	});
	it('should convert a weightedArea', () => {
		verifyFeature(makeWeightedAreaFeature());
	});
});
