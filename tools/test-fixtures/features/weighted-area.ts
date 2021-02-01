import { WeightedAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeWeightedAreaFeature = <I, P>(input?: I, props?: P): WeightedAreaState => ({
	properties: {
		type: 'weightedArea',
		id: uuid(),
		name: 'Weighted state',
		n: 255,
		ne: 0,
		e: 0,
		se: 0,
		s: 0,
		sw: 0,
		w: 0,
		nw: 0,
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
