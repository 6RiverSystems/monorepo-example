import { ImpassableAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeImpassableAreaFeature = <I, P>(input?: I, props?: P): ImpassableAreaState => ({
	properties: {
		type: 'impassable',
		id: uuid(),
		name: 'impassable state',
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
