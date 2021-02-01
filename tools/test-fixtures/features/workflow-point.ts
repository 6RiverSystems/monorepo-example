import { WorkflowPointState } from '@sixriver/map-io';
import uuid from 'uuid';

export const makeWorkflowPointFeature = <I, P>(input?: I, props?: P): WorkflowPointState => ({
	properties: {
		type: 'workflowPoint',
		name: 'workflow state',
		target: 'induct',
		object: 'vertex',
		orientation: 180,
		labels: ['label1', 'label2'],
		workflowOptions: ['option1'],
		id: uuid(),
		...props,
	},
	position: [23, 11],
	...input,
});
