import {
	AisleState,
	WorkflowPointState,
	AreasState,
	CostAreaState,
	SpeedLimitAreaState,
	WeightedAreaState,
	MapFeature,
} from '@sixriver/map-io';
import { useField, Field } from '@shopify/react-form';
import { get } from 'lodash-es';

import { Feature } from './map-inspector';

export type AreaFields =
	| 'id'
	| 'name'
	| 'type'
	| 'northEastX'
	| 'northEastY'
	| 'southWestX'
	| 'southWestY';

export type LocalCostFields = AreaFields | 'cost';

export type SpeedLimitFields = AreaFields | 'maxVelocity';

export type WeightedAreaFields = AreaFields | 'n' | 'ne' | 'nw' | 's' | 'sw' | 'se' | 'w' | 'e';

export type AisleFields =
	| 'id'
	| 'name'
	| 'type'
	| 'directed'
	| 'labels'
	| 'zoneLabels'
	| 'mixedLabels'
	| 'clearLabels'
	| 'swapDirection'
	| 'tailX'
	| 'tailY'
	| 'headX'
	| 'headY';

export type WorkflowPointFields =
	| 'id'
	| 'name'
	| 'type'
	| 'target'
	| 'orientation'
	| 'labels'
	| 'options'
	| 'mixedLabels'
	| 'mixedOptions'
	| 'clearLabels'
	| 'clearOptions'
	| 'x'
	| 'y';

export type MixedTargets = 'mixedTargets';
export type MultiWorkflowPointFields = WorkflowPointFields | MixedTargets;

/** Create fields based on feature information */
export function createFields(features: Feature[], types: MapFeature[], zoneLabels?: string[]) {
	const fields = {};
	for (let i = 0; i < types.length; i++) {
		for (let j = 0; j < features.length; j++) {
			const filteredFeatures = features.filter(features => features.properties.type === types[i]);
			if (filteredFeatures.length > 1) {
				fields[types[i]] = createMultiFields(filteredFeatures, zoneLabels);
			} else {
				fields[types[i]] = createSingleFields(filteredFeatures[0], zoneLabels);
			}
		}
	}
	return fields;
}
/** Create fields for a feature type if only one is selected */
function createSingleFields(feature: any, zoneLabels?: string[]): { [key: string]: Field<any> } {
	switch (feature.properties.type) {
		case 'keepOut':
		case 'impassable':
		case 'stayOnPath':
		case 'queue':
			return createAreaField(feature);
		case 'workflowPoint':
			return createWorkflowPointField(feature);
		case 'costArea':
			return createLocalCostField(feature);
		case 'speedLimit':
			return createSpeedLimitField(feature);
		case 'weightedArea':
			return createWeightedAreaField(feature);
		case 'aisle':
			return createAisleField(feature, zoneLabels);
		default:
			return {};
	}
}
/** Create fields for a feature type if muliple are selected */
function createMultiFields(filteredFeatures: Feature[], zoneLabels?: string[]) {
	switch (filteredFeatures[0].properties.type) {
		case 'keepOut':
		case 'impassable':
		case 'stayOnPath':
		case 'queue':
			return createMultiAreaFields(filteredFeatures);
		case 'workflowPoint':
			return createMultiWorkflowPointFields(filteredFeatures);
		case 'costArea':
			return createMultiLocalCostFields(filteredFeatures);
		case 'speedLimit':
			return createMultiSpeedLimitFields(filteredFeatures);
		case 'weightedArea':
			return createMultiWeightedAreaFields(filteredFeatures);
		case 'aisle':
			return createMultiAisleFields(filteredFeatures, zoneLabels);
		default:
			return {};
	}
}

/** Encompasses impassable, queue, stayOnPath, keepOut features */
function createAreaField(feature: AreasState): { [key in AreaFields]: Field<any> } {
	return {
		name: useField({
			value: String(feature.properties.name),
			validates: name => {
				if (
					!name &&
					(feature.properties.type === 'queue' || feature.properties.type === 'stayOnPath')
				) {
					return 'Name is required';
				}
			},
		}),
		id: useField(feature.properties.id),
		type: useField(feature.properties.type),
		southWestX: useField(String(feature.bounds[0][1])),
		southWestY: useField(String(feature.bounds[0][0])),
		northEastX: useField(String(feature.bounds[1][1])),
		northEastY: useField(String(feature.bounds[1][0])),
	};
}

function createLocalCostField(feature: CostAreaState): { [key in LocalCostFields]: Field<any> } {
	return {
		name: useField(feature.properties.name),
		id: useField(feature.properties.id),
		type: useField(feature.properties.type),
		cost: useField({
			value: String(feature.properties.cost),
			validates: cost => {
				if (cost === null || !cost || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 1 || Number(cost) > 250) {
					return 'Enter a value between 1 and 250';
				}
			},
		}),
		southWestX: useField(String(feature.bounds[0][1])),
		southWestY: useField(String(feature.bounds[0][0])),
		northEastX: useField(String(feature.bounds[1][1])),
		northEastY: useField(String(feature.bounds[1][0])),
	};
}

function createSpeedLimitField(
	feature: SpeedLimitAreaState,
): { [key in SpeedLimitFields]: Field<any> } {
	return {
		name: useField(feature.properties.name),
		id: useField(feature.properties.id),
		type: useField(feature.properties.type),
		maxVelocity: useField({
			value: String(feature.properties.maxVelocity),
			validates: velocity => {
				if (velocity == null || !velocity) {
					return 'Max velocity is required';
				}
				if (Number(velocity) < 0.1 || Number(velocity) > 1.3) {
					return 'Enter a value between 0.1 and 1.3';
				}
			},
		}),
		southWestX: useField(String(feature.bounds[0][1])),
		southWestY: useField(String(feature.bounds[0][0])),
		northEastX: useField(String(feature.bounds[1][1])),
		northEastY: useField(String(feature.bounds[1][0])),
	};
}

function createWeightedAreaField(
	feature: WeightedAreaState,
): { [key in WeightedAreaFields]: Field<any> } {
	return {
		name: useField(feature.properties.name),
		id: useField(feature.properties.id),
		type: useField(feature.properties.type),
		n: useField({
			value: String(feature.properties.n),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		ne: useField({
			value: String(feature.properties.ne),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		nw: useField({
			value: String(feature.properties.nw),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		s: useField({
			value: String(feature.properties.s),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		sw: useField({
			value: String(feature.properties.sw),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		se: useField({
			value: String(feature.properties.se),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		e: useField({
			value: String(feature.properties.e),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),
		w: useField({
			value: String(feature.properties.w),
			validates: cost => {
				if (cost === null || !cost) {
					return 'Cost is required';
				}
				if (Number(cost) < 0 || Number(cost) > 250) {
					return 'Enter a value between 0 to 250';
				}
			},
		}),

		southWestX: useField(String(feature.bounds[0][1])),
		southWestY: useField(String(feature.bounds[0][0])),
		northEastX: useField(String(feature.bounds[1][1])),
		northEastY: useField(String(feature.bounds[1][0])),
	};
}

function createWorkflowPointField(
	feature: WorkflowPointState,
): { [key in WorkflowPointFields]: Field<any> } {
	return {
		name: useField({
			value: String(feature.properties.name),
			validates: name => {
				if (!name) {
					return 'Name is required';
				}
			},
		}),
		id: useField(feature.properties.id),
		type: useField(feature.properties.type),
		target: useField(feature.properties.target || 'generic'),
		orientation: useField({
			value: String(feature.properties.orientation),
			validates: orientation => {
				if (orientation == null || !orientation) {
					return 'Orientation is required';
				}
				if (Number(orientation) < 0 || Number(orientation) > 360) {
					return 'Enter a value between 0 to 360';
				}
			},
		}),
		labels: useField(feature.properties.labels),
		options: useField(feature.properties.workflowOptions),

		mixedLabels: useField(false),
		mixedOptions: useField(false),
		clearLabels: useField(false),
		clearOptions: useField(false),

		x: useField(String(feature.position[0])),
		y: useField(String(feature.position[1])),
	};
}

function createAisleField(
	feature: AisleState,
	zoneLabels: string[],
): { [key in AisleFields]: Field<any> } {
	return {
		name: useField({
			value: String(feature.properties.name),
			validates: name => {
				if (!name) {
					return 'Name is required';
				}
			},
		}),
		id: useField(feature.properties.id),
		type: useField(feature.properties.type),
		directed: useField(feature.properties.directed),
		labels: useField(feature.properties.labels),

		zoneLabels: useField(zoneLabels || []),
		mixedLabels: useField(false),
		clearLabels: useField(false),
		swapDirection: useField(false),

		tailX: useField(String(feature.points[0][1])),
		tailY: useField(String(feature.points[0][0])),
		headX: useField(String(feature.points[1][1])),
		headY: useField(String(feature.points[1][0])),
	};
}

/** Encompasses impassable, queue, stayOnPath, keepOut features */
function createMultiAreaFields(filteredFeatures): { [key in AreaFields]: Field<any> } {
	return {
		name: useField(getFieldValue(filteredFeatures, 'properties.name', '')),
		id: useField(''),
		type: useField(filteredFeatures[0].properties.type),

		southWestX: useField(String(getFieldValue(filteredFeatures, 'bounds[0][1]', ''))),
		southWestY: useField(String(getFieldValue(filteredFeatures, 'bounds[0][0]', ''))),
		northEastX: useField(String(getFieldValue(filteredFeatures, 'bounds[1][1]', ''))),
		northEastY: useField(String(getFieldValue(filteredFeatures, 'bounds[1][0]', ''))),
	};
}

function createMultiLocalCostFields(filteredFeatures): { [key in LocalCostFields]: Field<any> } {
	return {
		name: useField(getFieldValue(filteredFeatures, 'properties.name', '')),
		id: useField(''),
		type: useField(filteredFeatures[0].properties.type),
		cost: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.cost', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 1 || Number(cost) > 250) {
						return 'Enter a value between 1 and 250';
					}
				}
			},
		}),

		southWestX: useField(String(getFieldValue(filteredFeatures, 'bounds[0][1]', ''))),
		southWestY: useField(String(getFieldValue(filteredFeatures, 'bounds[0][0]', ''))),
		northEastX: useField(String(getFieldValue(filteredFeatures, 'bounds[1][1]', ''))),
		northEastY: useField(String(getFieldValue(filteredFeatures, 'bounds[1][0]', ''))),
	};
}

function createMultiSpeedLimitFields(filteredFeatures): { [key in SpeedLimitFields]: Field<any> } {
	return {
		name: useField(getFieldValue(filteredFeatures, 'properties.name', '')),
		id: useField(''),
		type: useField(filteredFeatures[0].properties.type),
		maxVelocity: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.maxVelocity', '')),
			validates: velocity => {
				if (velocity) {
					if (Number(velocity) < 0.1 || Number(velocity) > 1.3) {
						return 'Enter a value between 0.1 and 1.3';
					}
				}
			},
		}),

		southWestX: useField(String(getFieldValue(filteredFeatures, 'bounds[0][1]', ''))),
		southWestY: useField(String(getFieldValue(filteredFeatures, 'bounds[0][0]', ''))),
		northEastX: useField(String(getFieldValue(filteredFeatures, 'bounds[1][1]', ''))),
		northEastY: useField(String(getFieldValue(filteredFeatures, 'bounds[1][0]', ''))),
	};
}

function createMultiWeightedAreaFields(
	filteredFeatures,
): { [key in WeightedAreaFields]: Field<any> } {
	return {
		name: useField(getFieldValue(filteredFeatures, 'properties.name', '')),
		id: useField(''),
		type: useField(filteredFeatures[0].properties.type),
		n: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.n', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		ne: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.ne', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		nw: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.nw', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		s: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.s', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		sw: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.sw', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		se: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.se', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		e: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.e', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),
		w: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.w', '')),
			validates: cost => {
				if (cost) {
					if (Number(cost) < 0 || Number(cost) > 250) {
						return 'Enter a value between 0 to 250';
					}
				}
			},
		}),

		southWestX: useField(String(getFieldValue(filteredFeatures, 'bounds[0][1]', ''))),
		southWestY: useField(String(getFieldValue(filteredFeatures, 'bounds[0][0]', ''))),
		northEastX: useField(String(getFieldValue(filteredFeatures, 'bounds[1][1]', ''))),
		northEastY: useField(String(getFieldValue(filteredFeatures, 'bounds[1][0]', ''))),
	};
}

function createMultiWorkflowPointFields(
	filteredFeatures,
): { [key in MultiWorkflowPointFields]: Field<any> } {
	return {
		name: useField(''),
		id: useField(''),
		type: useField(filteredFeatures[0].properties.type),
		orientation: useField({
			value: String(getFieldValue(filteredFeatures, 'properties.orientation', '')),
			validates: orientation => {
				if (orientation) {
					if (Number(orientation) < 0 || Number(orientation) > 360) {
						return 'Enter a value between 0 to 360';
					}
				}
			},
		}),
		target: useField(getFieldValue(filteredFeatures, 'properties.target', 'generic')),
		labels: useField(getTagFieldValue(filteredFeatures, 'properties.labels', [])),
		options: useField(getTagFieldValue(filteredFeatures, 'properties.workflowOptions', [])),

		mixedTargets: useField(getMixedValue(filteredFeatures, 'properties.target')),
		mixedLabels: useField(getMixedTagValue(filteredFeatures, 'properties.labels')),
		mixedOptions: useField(getMixedTagValue(filteredFeatures, 'properties.workflowOptions')),
		clearLabels: useField(false),
		clearOptions: useField(false),

		x: useField(String(getFieldValue(filteredFeatures, 'position[0]', ''))),
		y: useField(String(getFieldValue(filteredFeatures, 'position[1]', ''))),
	};
}

function createMultiAisleFields(
	filteredFeatures,
	zoneLabels?: string[],
): { [key in AisleFields]: Field<any> } {
	return {
		name: useField(''),
		id: useField(''),
		type: useField(filteredFeatures[0].properties.type),
		directed: useField(getFieldValue(filteredFeatures, 'properties.directed', 'mixed')),
		labels: useField(getTagFieldValue(filteredFeatures, 'properties.labels', [])),

		zoneLabels: useField(zoneLabels || []),
		mixedLabels: useField(getMixedTagValue(filteredFeatures, 'properties.labels')),
		clearLabels: useField(false),
		swapDirection: useField(false),

		tailX: useField(String(getFieldValue(filteredFeatures, 'points[0][1]', ''))),
		tailY: useField(String(getFieldValue(filteredFeatures, 'points[0][0]', ''))),
		headX: useField(String(getFieldValue(filteredFeatures, 'points[1][1]', ''))),
		headY: useField(String(getFieldValue(filteredFeatures, 'points[1][0]', ''))),
	};
}

/** Returns true if a property of multiple selected features varies  */
export function getMixedValue(filteredFeatures, path): boolean {
	const compValue = get(filteredFeatures[0], path, null);
	if (compValue == null) {
		return true;
	}
	for (let i = 0; i < filteredFeatures.length; i++) {
		if (compValue !== get(filteredFeatures[i], path, null)) {
			return true;
		}
	}
	return false;
}
/** Returns true if a tag property of multiple selected features varies */
export function getMixedTagValue(filteredFeatures, path): boolean {
	const compValue = get(filteredFeatures[0], path, null);
	if (compValue == null) {
		return true;
	}
	for (let i = 0; i < filteredFeatures.length; i++) {
		if (get(filteredFeatures[i], path, null).every(e => compValue.includes(e)) === false) {
			return true;
		}
	}
	return false;
}
/** Returns the tag value to assign to fields. If all tags for group of selected features are the same,
 * returns the tag value of the first feature. If the tag value varies, returns a default value */
export function getTagFieldValue(filteredFeatures, path, def) {
	const compValue = get(filteredFeatures[0], path, null);
	if (compValue == null) {
		return def;
	}
	for (let i = 0; i < filteredFeatures.length; i++) {
		if (get(filteredFeatures[i], path, null).every(e => compValue.includes(e)) === false) {
			return def;
		}
	}
	return compValue;
}
/** Returns the value to assign to fields.  If the property a for group of selected features are the same,
 * returns the value of the first feature. If the property value varies, returns a default value */
export function getFieldValue(filteredFeatures, path, def) {
	const compValue = get(filteredFeatures[0], path, null);
	if (compValue == null) {
		return def;
	}
	for (let i = 0; i < filteredFeatures.length; i++) {
		if (compValue !== get(filteredFeatures[i], path, null)) {
			return def;
		}
	}
	return compValue;
}
/** Returns an array of feature types selected */
export function getTypes(features: Feature[]): MapFeature[] {
	const totalTypes = features.map(feature => feature.properties.type);
	const types = [...new Set(totalTypes)];
	return types;
}
/** Returns an object of tab values for multi select */
export function getTabs(types, features): { id: MapFeature; content: string }[] {
	const title: { [key in MapFeature]: string } = {
		workflowPoint: 'Workflow Point',
		aisle: 'Aisle',
		costArea: 'Local Cost Area',
		impassable: 'Impassable',
		keepOut: 'Keep Out',
		queue: 'Queue',
		stayOnPath: 'Stay-On-Path',
		speedLimit: 'Speed Limit',
		weightedArea: 'Weighted Area',
		area: 'Area',
		mfpDisplay: 'mfpDisplay',
		playSoundArea: 'playSoundArea',
		occupancyGrid: 'occupancyGrid',
	};
	const tabs = [];
	const totalTypes = features.map(feature => feature.properties.type);
	for (let i = 0; i < types.length; i++) {
		const tab = {};
		const count = totalTypes.filter(type => type === types[i]).length;
		tab['id'] = types[i];
		tab['content'] = title[types[i]] + ` (${count})`;
		tabs.push(tab);
	}
	return tabs;
}
/** Returns a filtered array of Features based on feature type */
export function getFilteredFeatures(features: Feature[], type: MapFeature): Feature[] {
	return features.filter(feature => feature.properties.type === type);
}
/** Returns tag help text if tag fields vary across multiple selected features */
export function getTagHelpText(mixedTagField) {
	if (mixedTagField.value === true) {
		return 'Tags vary across selected features';
	}
	return null;
}
