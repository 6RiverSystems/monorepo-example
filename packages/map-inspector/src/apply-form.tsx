import {
	AisleState,
	WorkflowPointState,
	CostAreaState,
	SpeedLimitAreaState,
	WeightedAreaState,
	AreasState,
} from '@sixriver/map-io';

import { Feature } from './map-inspector';
import {
	LocalCostFields,
	SpeedLimitFields,
	WeightedAreaFields,
	AisleFields,
	MultiWorkflowPointFields,
} from './create-fields';

/** Apply feature state to flat object fieldValues. Pass returned array of objects to the map stack */
export function applyFormToFeatures(filteredFeatures: Feature[], fieldValues): Feature[] {
	const isMulti = filteredFeatures.length > 1;
	return filteredFeatures.map(feature => {
		const type = feature.properties.type;
		if (type === 'workflowPoint') {
			return applyFormToWorkflowPoint(fieldValues, feature as WorkflowPointState, isMulti);
		} else if (type === 'aisle') {
			return applyFormToAisle(fieldValues, feature as AisleState, isMulti);
		} else {
			return applyFormToArea(fieldValues, feature as AreasState, type);
		}
	});
}

function applyFormToArea<T>(
	fieldValues: {
		[key in LocalCostFields | WeightedAreaFields | SpeedLimitFields]: string;
	},
	feature: AreasState,
	type: AreasState['properties']['type'],
): AreasState {
	let extraProps: any;
	if (type === 'weightedArea') {
		feature = feature as WeightedAreaState;
		extraProps = {
			n: fieldValues.n !== '' ? Number(fieldValues.n) : feature.properties.n,
			ne: fieldValues.ne !== '' ? Number(fieldValues.ne) : feature.properties.ne,
			nw: fieldValues.nw !== '' ? Number(fieldValues.nw) : feature.properties.nw,
			s: fieldValues.s !== '' ? Number(fieldValues.s) : feature.properties.s,
			sw: fieldValues.sw !== '' ? Number(fieldValues.sw) : feature.properties.sw,
			se: fieldValues.se !== '' ? Number(fieldValues.se) : feature.properties.se,
			e: fieldValues.e !== '' ? Number(fieldValues.e) : feature.properties.e,
			w: fieldValues.w !== '' ? Number(fieldValues.w) : feature.properties.w,
		};
	} else if (type === 'queue') {
		extraProps = {
			queueName: '', // is queue name deprecated?
		};
	} else if (type === 'costArea') {
		feature = feature as CostAreaState;
		extraProps = {
			cost: Number(fieldValues.cost) || feature.properties.cost,
		};
	} else if (type === 'speedLimit') {
		feature = feature as SpeedLimitAreaState;
		extraProps = {
			maxVelocity: Number(fieldValues.maxVelocity) || feature.properties.maxVelocity,
		};
	}
	return {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
			...extraProps,
		},
		bounds: [
			[
				Number(fieldValues.southWestY) || feature.bounds[0][0],
				Number(fieldValues.southWestX) || feature.bounds[0][1],
			],
			[
				Number(fieldValues.northEastY) || feature.bounds[1][0],
				Number(fieldValues.northEastX) || feature.bounds[1][1],
			],
		],
	};
}

function applyFormToWorkflowPoint(
	fieldValues: { [key in MultiWorkflowPointFields]: any },
	feature: WorkflowPointState,
	isMulti: boolean,
): WorkflowPointState {
	const featureState: WorkflowPointState = {
		properties: {
			name: isMulti ? feature.properties.name : fieldValues.name,
			id: feature.properties.id,
			type: 'workflowPoint',
			target: isMulti
				? getTargetValue(feature.properties.target, fieldValues.target, fieldValues.mixedTargets)
				: fieldValues.target,
			orientation: Number(fieldValues.orientation) || feature.properties.orientation,
			object: 'vertex',
			labels: isMulti
				? getTagValue(
						feature.properties.labels,
						fieldValues.clearLabels,
						fieldValues.labels,
						fieldValues.mixedLabels,
				  )
				: fieldValues.labels,
			workflowOptions: isMulti
				? getTagValue(
						feature.properties.workflowOptions,
						fieldValues.clearOptions,
						fieldValues.options,
						fieldValues.mixedOptions,
				  )
				: fieldValues.options,
		},
		position: [
			Number(fieldValues.x) || feature.position[0],
			Number(fieldValues.y) || feature.position[1],
		],
	};

	return featureState;
}

function applyFormToAisle(
	fieldValues: { [key in AisleFields]: any },
	feature: AisleState,
	isMulti: boolean,
): AisleState {
	const featureState: AisleState = {
		properties: {
			name: isMulti ? feature.properties.name : fieldValues.name,
			id: feature.properties.id,
			type: 'aisle',
			object: 'aisle',
			labels: isMulti
				? getTagValue(
						feature.properties.labels,
						fieldValues.clearLabels,
						fieldValues.labels,
						fieldValues.mixedLabels,
				  )
				: fieldValues.labels,
			directed:
				fieldValues.directed === 'mixed' && isMulti
					? feature.properties.directed
					: fieldValues.directed,
		},
		points: isMulti
			? [
					[
						Number(
							getAisleCoordinate(
								fieldValues.swapDirection,
								feature.points[0][0],
								feature.points[1][0],
								fieldValues.tailY,
							),
						),
						Number(
							getAisleCoordinate(
								fieldValues.swapDirection,
								feature.points[0][1],
								feature.points[1][1],
								fieldValues.tailX,
							),
						),
					],
					[
						Number(
							getAisleCoordinate(
								fieldValues.swapDirection,
								feature.points[1][0],
								feature.points[0][0],
								fieldValues.headY,
							),
						),
						Number(
							getAisleCoordinate(
								fieldValues.swapDirection,
								feature.points[1][1],
								feature.points[0][1],
								fieldValues.headX,
							),
						),
					],
			  ]
			: [
					[Number(fieldValues.tailY), Number(fieldValues.tailX)],
					[Number(fieldValues.headY), Number(fieldValues.headX)],
			  ],
	};

	return featureState;
}

function getTagValue(featureValue, clearField, fieldValue, mixedTagField) {
	if (clearField && fieldValue.length === 0) {
		return [];
	} else {
		if (mixedTagField === true && fieldValue.length === 0) {
			return featureValue;
		} else {
			return fieldValue;
		}
	}
}

function getTargetValue(featureValue, fieldValue, mixedTargetField) {
	if (mixedTargetField && fieldValue === 'generic') {
		return featureValue ? featureValue : 'generic';
	}
	return fieldValue;
}

function getAisleCoordinate(swapDirectionField, featureValue, featureValueSwapped, fieldValue) {
	if (swapDirectionField) {
		if (fieldValue) {
			return fieldValue;
		}
		return featureValueSwapped;
	}
	return fieldValue ? fieldValue : featureValue;
}
