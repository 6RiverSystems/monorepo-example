import React, { useCallback, useState, useEffect, useContext } from 'react';
import { TextField, FormLayout, Select, InlineError } from '@shopify/polaris';
import { getWeightedAreaDirection } from './weighted-area-direction';
import { ManualDirectionEditor } from './weighted-area-manual-editor';
import { FormContext } from '../form-context';

/**
 * Display direction info of a weighted area. Allows user
 * to set the direction of the weighted area and assign a cost to that direction.
 */
export function AutoDirectionEditor() {
	const {
		fields: { n, ne, nw, s, se, sw, e, w },
		multi,
	} = useContext(FormContext);

	const weighted = {
		north: [n, ne, nw],
		south: [s, se, sw],
		west: [sw, nw, w],
		east: [e, ne, se],
		equallyWeighted: [e, ne, se, sw, nw, n, s, w],
	};
	const noWeight = {
		north: [s, se, sw, w, e],
		south: [n, ne, nw, w, e],
		west: [n, ne, se, s, e],
		east: [sw, nw, n, s, w],
		equallyWeighted: [],
	};

	function updateCosts(direction, cost, weighted, noWeight) {
		weighted[direction].forEach(direction => direction.onChange(cost));
		noWeight[direction].forEach(direction => direction.onChange('0'));
	}
	const [direction, setDirection] = useState(
		getWeightedAreaDirection(n, ne, nw, s, se, sw, e, w).direction,
	);
	const handleDirection = useCallback(newValue => {
		setDirection(newValue);
	}, []);

	const [cost, setCost] = useState(getWeightedAreaDirection(n, ne, nw, s, se, sw, e, w).cost);
	const handleCost = useCallback(newValue => {
		setCost(newValue);
	}, []);

	useEffect(() => {
		if (direction !== 'manual') {
			updateCosts(direction, cost, weighted, noWeight);
		}
	}, [direction, cost]);

	const weightedDirections = [
		{ label: 'north', value: 'north' },
		{ label: 'south', value: 'south' },
		{ label: 'west', value: 'west' },
		{ label: 'east', value: 'east' },
		{ label: 'all directions', value: 'equallyWeighted' },
		{ label: 'manual', value: 'manual' },
	];

	const isInvalid = getCostError(cost, multi) ? true : false;
	const costField =
		direction === 'manual' ? (
			<ManualDirectionEditor />
		) : (
			<div>
				<TextField
					type="number"
					error={isInvalid}
					label="Cost"
					onChange={handleCost}
					value={cost}
				/>
				<InlineError message={getCostError(cost, multi)} fieldID={'costField'} />
			</div>
		);

	return (
		<React.Fragment>
			<Select
				label="Direction"
				options={weightedDirections}
				onChange={handleDirection}
				value={direction}
			/>
			{costField}
		</React.Fragment>
	);
}

function getCostError(cost, multi) {
	if (!multi) {
		if (cost === '') {
			return 'Cost is required';
		} else if (Number(cost) < 1 || Number(cost) > 250) {
			return 'Enter a value between 1 and 250';
		}
	}
	if (cost) {
		if (Number(cost) < 1 || Number(cost) > 250) {
			return 'Enter a value between 1 and 250';
		}
	}
	return null;
}
