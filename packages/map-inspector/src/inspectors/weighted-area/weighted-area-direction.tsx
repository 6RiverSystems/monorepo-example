import { Field } from '@shopify/react-form';
/** Filters the directions of a weighted area and returns the general direction of the area and its cost */
export function getWeightedAreaDirection(
	n: Field<any>,
	ne: Field<any>,
	nw: Field<any>,
	s: Field<any>,
	se: Field<any>,
	sw: Field<any>,
	e: Field<any>,
	w: Field<any>,
) {
	const rawWeightedDirection = [
		{ cost: n.value },
		{ cost: ne.value },
		{ cost: nw.value },
		{ cost: s.value },
		{ cost: se.value },
		{ cost: sw.value },
		{ cost: e.value },
		{ cost: w.value },
	];

	const manual = {
		direction: 'manual',
		cost: '0',
	};

	if (rawWeightedDirection.filter(direction => direction.cost === '').length > 0) {
		return manual;
	}

	const weightedDirection = [
		{ cost: Number(n.value), direction: 'n' },
		{ cost: Number(ne.value), direction: 'ne' },
		{ cost: Number(nw.value), direction: 'nw' },
		{ cost: Number(s.value), direction: 's' },
		{ cost: Number(se.value), direction: 'se' },
		{ cost: Number(sw.value), direction: 'sw' },
		{ cost: Number(e.value), direction: 'e' },
		{ cost: Number(w.value), direction: 'w' },
	];
	const north = ['n', 'ne', 'nw'];
	const south = ['s', 'se', 'sw'];
	const west = ['w', 'sw', 'nw'];
	const east = ['e', 'ne', 'se'];

	const weights = weightedDirection.filter(direction => direction.cost > 0);
	const zeros = weightedDirection.filter(direction => direction.cost === 0);

	if (weights.length === 3 && zeros.length === 5) {
		const equalWeights = weightedDirection.filter(direction => direction.cost === weights[0].cost);
		if (equalWeights.length === 3) {
			const dir = equalWeights.map(direction => direction.direction);
			if (dir.every(e => north.includes(e))) {
				return {
					direction: 'north',
					cost: n.value,
				};
			} else if (dir.every(e => east.includes(e))) {
				return {
					direction: 'east',
					cost: e.value,
				};
			} else if (dir.every(e => west.includes(e))) {
				return {
					direction: 'west',
					cost: w.value,
				};
			} else if (dir.every(e => south.includes(e))) {
				return {
					direction: 'south',
					cost: s.value,
				};
			}
		}
	} else if (weights.length === 8) {
		const equalWeights = weightedDirection.filter(direction => direction.cost === weights[0].cost);
		if (equalWeights.length === 8) {
			return {
				direction: 'equallyWeighted',
				cost: n.value,
			};
		}
	}
	return manual;
}
