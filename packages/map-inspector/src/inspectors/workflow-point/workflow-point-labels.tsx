const inductLabels = [
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
] as const;

const takeoffRegularLabels = [
	{ value: 'takeoff', label: 'takeoff' },
	{ value: 'regular', label: 'regular' },
] as const;

const takeoffDestinationLabels = [
	{ value: 'takeoff', label: 'takeoff' },
	{ value: 'regular', label: 'regular' },
] as const;

const takeoffExceptionLabels = [
	{ value: 'takeoff', label: 'takeoff' },
	{ value: 'exception', label: 'exception' },
] as const;

const meetingPointLabels = [
	{ value: 'picking', label: 'picking' },
	{ value: 'repick', label: 'repick' },
] as const;

const postPickLabels = [{ value: 'postpick', label: 'postpick' }] as const;

const postChargeLabels = [
	{ value: 'charge', label: 'charge' },
	{ value: 'postCharge', label: 'postCharge' },
] as const;

const preChargeLabels = [
	{ value: 'charge', label: 'charge' },
	{ value: 'preCharge', label: 'preCharge' },
] as const;

const replenInductLabels = [
	{ value: 'replenInduct', label: 'replenInduct' },
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
] as const;

const replenMeetingPointLabels = [
	{ value: 'replen', label: 'replen' },
	{ value: 'picking', label: 'picking' },
	{ value: 'repick', label: 'repick' },
] as const;

const replenTakeoffLabels = [
	{ value: 'replenTakeoff', label: 'replenTakeoff' },
	{ value: 'takeoff', label: 'takeoff' },
	{ value: 'regular', label: 'regular' },
] as const;

const labels = {
	induct: inductLabels,
	userDirectedInduct: inductLabels,
	meetingPoint: meetingPointLabels,
	takeoff: takeoffRegularLabels,
	takeoffException: takeoffExceptionLabels,
	takeoffDestination: takeoffDestinationLabels,
	postPick: postPickLabels,
	postCharge: postChargeLabels,
	preCharge: preChargeLabels,
	replenInduct: replenInductLabels,
	replenMeetingPoint: replenMeetingPointLabels,
	replenTakeoff: replenTakeoffLabels,
};
/**
 * Returns list of workflow point labels for a workflow point type
 */
export function workflowPointLabels(type) {
	return labels.hasOwnProperty(type) ? labels[type] : [];
}
