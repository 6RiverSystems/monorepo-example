import { SpeedLimitAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeSpeedLimitAreaFeature = <I, P>(input?: I, props?: P): SpeedLimitAreaState => ({
	properties: {
		type: 'speedLimit',
		id: uuid(),
		name: 'SpeedLimit state',
		maxVelocity: 200,
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
