import { StayOnPathAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeStayOnPathAreaFeature = <I, P>(input?: I, props?: P): StayOnPathAreaState => ({
	properties: {
		type: 'stayOnPath',
		id: uuid(),
		name: 'StayOnPath state',
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
