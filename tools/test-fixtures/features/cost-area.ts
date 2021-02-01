import { CostAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeCostAreaFeature = <I, P>(input?: I, props?: P): CostAreaState => ({
	properties: {
		type: 'costArea',
		id: uuid(),
		name: 'KeppOut state',
		cost: 100,
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
