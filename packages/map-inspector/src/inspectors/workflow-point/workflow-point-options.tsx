const inductOptions = [
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
] as const;

const userDirectedInductOptions = [
	{ value: 'userDirectedInduct', label: 'user directed induct' },
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
] as const;

const replenInductOptions = [
	{ value: 'replenInduct', label: 'replenInduct' },
	{ value: 'induct', label: 'induct' },
	{ value: 'restage', label: 'restage' },
] as const;

const options = {
	induct: inductOptions,
	userDirectedInduct: userDirectedInductOptions,
	replenInduct: replenInductOptions,
};
/**
 * Returns list of workflow point options for a workflow point type
 */
export function workflowPointOptions(type) {
	return options.hasOwnProperty(type) ? options[type] : [];
}
