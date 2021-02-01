import { KeepOutAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeKeepOutAreaFeature = <I, P>(input?: I, props?: P): KeepOutAreaState => ({
	properties: {
		type: 'keepOut',
		id: uuid(),
		name: 'KeppOut state',
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
