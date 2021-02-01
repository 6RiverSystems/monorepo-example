import { AisleState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeAisleFeature = <I, P>(input?: I, props?: P): AisleState => ({
	properties: {
		type: 'aisle',
		object: 'aisle',
		directed: true,
		labels: [],
		id: uuid(),
		name: 'aisle state',
		...props,
	},
	points: [
		[23, 11],
		[10, 13],
	],
	...input,
});
