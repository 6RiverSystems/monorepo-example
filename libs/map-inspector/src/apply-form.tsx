import {
	AisleState,
	WorkflowPointState,
	ImpassableAreaState,
	CostAreaState,
	KeepOutAreaState,
	QueueAreaState,
	SpeedLimitAreaState,
	WeightedAreaState,
	StayOnPathAreaState,
	Bounds,
} from '@sixriver/map-io';

import { Feature } from './map-inspector';
import {
	AreaFields,
	LocalCostFields,
	SpeedLimitFields,
	WorkflowPointFields,
	WeightedAreaFields,
	AisleFields,
	MultiWorkflowPointFields,
} from './create-fields';

/** Apply feature state to flat object fieldValues. Pass returned array of objects to the map stack */
export function applyFormToFeatures(filteredFeatures: Feature[], fieldValues): Feature[] {
	if (filteredFeatures.length > 1) {
		return filteredFeatures.map(feature => {
			switch (feature.properties.type) {
				case 'keepOut':
					return applyFormToMultiKeepOut(feature, fieldValues);
				case 'impassable':
					return applyFormToMultiImpassable(feature, fieldValues);
				case 'stayOnPath':
					return applyFormToMultiStayOnPath(feature, fieldValues);
				case 'queue':
					return applyFormToMultiQueue(feature, fieldValues);
				case 'workflowPoint':
					return applyFormToMultiWorkflowPoint(feature, fieldValues);
				case 'costArea':
					return applyFormToMultiLocalCostArea(feature, fieldValues);
				case 'speedLimit':
					return applyFormToMultiSpeedLimit(feature, fieldValues);
				case 'weightedArea':
					return applyFormToMultiWeightedArea(feature, fieldValues);
				case 'aisle':
					return applyFormToMultiAisle(feature, fieldValues);
				default:
					return;
			}
		});
	}
	switch (filteredFeatures[0].properties.type) {
		case 'impassable':
			return applyFormToImpassable(fieldValues);
		case 'keepOut':
			return applyFormToKeepOut(fieldValues);
		case 'stayOnPath':
			return applyFormToStayOnPath(fieldValues);
		case 'queue':
			return applyFormToQueue(fieldValues);
		case 'costArea':
			return applyFormToLocalCostArea(fieldValues);
		case 'speedLimit':
			return applyFormToSpeedLimit(fieldValues);
		case 'weightedArea':
			return applyFormToWeightedArea(fieldValues);
		case 'workflowPoint':
			return applyFormToWorkflowPoint(fieldValues);
		case 'aisle':
			return applyFormToAisle(fieldValues);
		default:
			return;
	}
}

function getBounds(southWestX, southWestY, northEastX, northEastY): Bounds {
	return [
		[Number(southWestY), Number(southWestX)],
		[Number(northEastY), Number(northEastX)],
	];
}

// function getMultiBounds()

function applyFormToImpassable(
	fieldValues: { [key in AreaFields]: string },
): ImpassableAreaState[] {
	const featureState: ImpassableAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'impassable',
		},

		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToKeepOut(fieldValues: { [key in AreaFields]: string }): KeepOutAreaState[] {
	const featureState: KeepOutAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'keepOut',
		},
		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToStayOnPath(
	fieldValues: { [key in AreaFields]: string },
): StayOnPathAreaState[] {
	const featureState: StayOnPathAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'stayOnPath',
		},
		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToQueue(fieldValues: { [key in AreaFields]: string }): QueueAreaState[] {
	const featureState: QueueAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'queue',
			queueName: '',
		},
		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToLocalCostArea(
	fieldValues: { [key in LocalCostFields]: string },
): CostAreaState[] {
	const featureState: CostAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'costArea',
			cost: Number(fieldValues.cost),
		},
		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToSpeedLimit(
	fieldValues: { [key in SpeedLimitFields]: string },
): SpeedLimitAreaState[] {
	const featureState: SpeedLimitAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'speedLimit',
			maxVelocity: Number(fieldValues.maxVelocity),
		},
		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToWeightedArea(
	fieldValues: { [key in WeightedAreaFields]: string },
): WeightedAreaState[] {
	const featureState: WeightedAreaState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'weightedArea',
			n: Number(fieldValues.n),
			ne: Number(fieldValues.ne),
			nw: Number(fieldValues.nw),
			s: Number(fieldValues.s),
			sw: Number(fieldValues.sw),
			se: Number(fieldValues.se),
			e: Number(fieldValues.e),
			w: Number(fieldValues.w),
		},
		bounds: getBounds(
			fieldValues.southWestX,
			fieldValues.southWestY,
			fieldValues.northEastX,
			fieldValues.northEastY,
		),
	};
	return [featureState];
}

function applyFormToWorkflowPoint(
	fieldValues: { [key in WorkflowPointFields]: any },
): WorkflowPointState[] {
	const featureState: WorkflowPointState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'workflowPoint',
			target: fieldValues.target,
			orientation: Number(fieldValues.orientation),
			object: 'vertex',
			labels: fieldValues.labels,
			workflowOptions: fieldValues.options,
		},
		position: [Number(fieldValues.x), Number(fieldValues.y)],
	};

	return [featureState];
}

function applyFormToAisle(fieldValues: { [key in AisleFields]: any }): AisleState[] {
	const featureState: AisleState = {
		properties: {
			name: fieldValues.name,
			id: fieldValues.id,
			type: 'aisle',
			object: 'aisle',
			labels: fieldValues.labels,
			directed: fieldValues.directed,
		},
		points: [
			[Number(fieldValues.tailX), Number(fieldValues.tailY)],
			[Number(fieldValues.headX), Number(fieldValues.headY)],
		],
	};

	return [featureState];
}

function applyFormToMultiImpassable(
	feature,
	fieldValues: { [key in AreaFields]: string },
): ImpassableAreaState {
	console.log(feature);
	const featureState: ImpassableAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
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
	return featureState;
}

function applyFormToMultiKeepOut(
	feature,
	fieldValues: { [key in AreaFields]: string },
): KeepOutAreaState {
	const featureState: KeepOutAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
		},
		bounds: [
			[
				Number(fieldValues.southWestX) || feature.bounds[0][1],
				Number(fieldValues.southWestY) || feature.bounds[0][0],
			],
			[
				Number(fieldValues.northEastX) || feature.bounds[1][1],
				Number(fieldValues.northEastY) || feature.bounds[1][0],
			],
		],
	};
	return featureState;
}

function applyFormToMultiStayOnPath(
	feature,
	fieldValues: { [key in AreaFields]: string },
): StayOnPathAreaState {
	const featureState: StayOnPathAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
		},
		bounds: [
			[
				Number(fieldValues.southWestX) || feature.bounds[0][1],
				Number(fieldValues.southWestY) || feature.bounds[0][0],
			],
			[
				Number(fieldValues.northEastX) || feature.bounds[1][1],
				Number(fieldValues.northEastY) || feature.bounds[1][0],
			],
		],
	};
	return featureState;
}

function applyFormToMultiQueue(
	feature,
	fieldValues: { [key in AreaFields]: string },
): QueueAreaState {
	const featureState: QueueAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
			queueName: '',
		},
		bounds: [
			[
				Number(fieldValues.southWestX) || feature.bounds[0][1],
				Number(fieldValues.southWestY) || feature.bounds[0][0],
			],
			[
				Number(fieldValues.northEastX) || feature.bounds[1][1],
				Number(fieldValues.northEastY) || feature.bounds[1][0],
			],
		],
	};
	return featureState;
}

function applyFormToMultiLocalCostArea(
	feature,
	fieldValues: { [key in LocalCostFields]: string },
): CostAreaState {
	const featureState: CostAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
			cost: Number(fieldValues.cost) || feature.properties.cost,
		},
		bounds: [
			[
				Number(fieldValues.southWestX) || feature.bounds[0][1],
				Number(fieldValues.southWestY) || feature.bounds[0][0],
			],
			[
				Number(fieldValues.northEastX) || feature.bounds[1][1],
				Number(fieldValues.northEastY) || feature.bounds[1][0],
			],
		],
	};
	return featureState;
}

function applyFormToMultiSpeedLimit(
	feature,
	fieldValues: { [key in SpeedLimitFields]: string },
): SpeedLimitAreaState {
	const featureState: SpeedLimitAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
			maxVelocity: Number(fieldValues.maxVelocity) || feature.properties.maxVelocity,
		},
		bounds: [
			[
				Number(fieldValues.southWestX) || feature.bounds[0][1],
				Number(fieldValues.southWestY) || feature.bounds[0][0],
			],
			[
				Number(fieldValues.northEastX) || feature.bounds[1][1],
				Number(fieldValues.northEastY) || feature.bounds[1][0],
			],
		],
	};
	return featureState;
}

function applyFormToMultiWeightedArea(
	feature,
	fieldValues: { [key in WeightedAreaFields]: string },
): WeightedAreaState {
	const featureState: WeightedAreaState = {
		properties: {
			name: fieldValues.name || feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
			n: fieldValues.n !== '' ? Number(fieldValues.n) : feature.properties.n,
			ne: fieldValues.ne !== '' ? Number(fieldValues.ne) : feature.properties.ne,
			nw: fieldValues.nw !== '' ? Number(fieldValues.nw) : feature.properties.nw,
			s: fieldValues.s !== '' ? Number(fieldValues.s) : feature.properties.s,
			sw: fieldValues.sw !== '' ? Number(fieldValues.sw) : feature.properties.sw,
			se: fieldValues.se !== '' ? Number(fieldValues.se) : feature.properties.se,
			e: fieldValues.e !== '' ? Number(fieldValues.e) : feature.properties.e,
			w: fieldValues.w !== '' ? Number(fieldValues.w) : feature.properties.w,
		},
		bounds: [
			[
				Number(fieldValues.southWestX) || feature.bounds[0][1],
				Number(fieldValues.southWestY) || feature.bounds[0][0],
			],
			[
				Number(fieldValues.northEastX) || feature.bounds[1][1],
				Number(fieldValues.northEastY) || feature.bounds[1][0],
			],
		],
	};
	return featureState;
}

function applyFormToMultiWorkflowPoint(
	feature,
	fieldValues: { [key in MultiWorkflowPointFields]: any },
): WorkflowPointState {
	const featureState: WorkflowPointState = {
		properties: {
			name: feature.properties.name,
			id: feature.properties.id,
			type: feature.properties.type,
			target: getTargetValue(
				feature.properties.target,
				fieldValues.target,
				fieldValues.mixedTargets,
			),
			orientation: Number(fieldValues.orientation) || feature.properties.orientation,
			object: 'vertex',
			labels: getTagValue(
				feature.properties.labels,
				fieldValues.clearLabels,
				fieldValues.labels,
				fieldValues.mixedLabels,
			),
			workflowOptions: getTagValue(
				feature.properties.workflowOptions,
				fieldValues.clearOptions,
				fieldValues.options,
				fieldValues.mixedOptions,
			),
		},
		position: [
			Number(fieldValues.x) || feature.position[0],
			Number(fieldValues.y) || feature.position[1],
		],
	};
	return featureState;
}

function applyFormToMultiAisle(feature, fieldValues: { [key in AisleFields]: any }): AisleState {
	const featureState: AisleState = {
		properties: {
			name: feature.properties.name,
			id: feature.properties.id,
			type: 'aisle',
			object: 'aisle',
			labels: getTagValue(
				feature.properties.labels,
				fieldValues.clearLabels,
				fieldValues.labels,
				fieldValues.mixedLabels,
			),
			directed:
				fieldValues.directed === 'mixed' ? feature.properties.directed : fieldValues.directed,
		},
		points: [
			[
				Number(
					getAisleCoordinate(
						fieldValues.swapDirection,
						feature.points[0][1],
						feature.points[1][1],
						fieldValues.tailY,
					),
				),
				Number(
					getAisleCoordinate(
						fieldValues.swapDirection,
						feature.points[0][0],
						feature.points[1][0],
						fieldValues.tailX,
					),
				),
			],
			[
				Number(
					getAisleCoordinate(
						fieldValues.swapDirection,
						feature.points[1][1],
						feature.points[0][1],
						fieldValues.headY,
					),
				),
				Number(
					getAisleCoordinate(
						fieldValues.swapDirection,
						feature.points[1][0],
						feature.points[0][0],
						fieldValues.headX,
					),
				),
			],
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
