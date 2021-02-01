import { Chance } from 'chance';

import { WorkflowPointState } from '../../interfaces/workflow-point-state';
import { WorkflowPoint } from './WorkflowPoint';
import { Pose } from '../../interfaces/pose';

describe('WorkflowPoint', () => {
	const chance = new Chance();
	it('should create a workflow point with an ID', () => {
		const id = chance.guid();
		const workflowPoint = new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, id);
		expect(workflowPoint.id).toEqual(id);
	});

	it('updateEnabledState', () => {
		const id = chance.guid();
		const workflowPoint = new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, id);
		expect(workflowPoint.enabled).toEqual(true);
		const workflowPointState = <WorkflowPointState>{
			maxReservationCount: 9,
			enabled: false,
			mapPointName: id,
		};
		workflowPoint.updateEnabledState(workflowPointState);
		expect(workflowPoint.enabled).toEqual(false);
	});
});
