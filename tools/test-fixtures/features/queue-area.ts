import { QueueAreaState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeQueueAreaFeature = <I, P>(input?: I, props?: P): QueueAreaState => ({
	properties: {
		type: 'queue',
		id: uuid(),
		name: 'Queue state',
		queueName: 'queue name',
		...props,
	},
	bounds: [
		[111, 222],
		[223, 333],
	],
	...input,
});
