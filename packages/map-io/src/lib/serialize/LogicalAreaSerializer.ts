/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from './ParseUtils';
import { GeoJSONFeature } from './GeoJSON';

export enum LayerType {
	Aisle = 'aisle',
	Area = 'area',
	CostArea = 'costArea',
	ImpassableArea = 'impassable',
	KeepOutArea = 'keepOut',
	MfpDisplay = 'mfpDisplay',
	PlaySoundArea = 'playSoundArea', // deprecated
	QueueArea = 'queue',
	StayOnPathArea = 'stayOnPath',
	SpeedLimitArea = 'speedLimit',
	WeightedArea = 'weightedArea',
	WorkflowPoint = 'workflowPoint',
	OccupancyGrid = 'occupancyGrid',
}

export class LogicalAreaSerializer extends GeoJSONFeature {
	static isValid(area: GeoJSONFeature): boolean {
		if (area.geometry.type !== 'Polygon') {
			return false;
		}

		try {
			const guid: string = ParseUtils.getRequiredField(area, 'properties.id', 'string');
			const type: LayerType = ParseUtils.getRequiredField(area, 'properties.type', 'string');

			switch (type) {
				case LayerType.ImpassableArea:
				case LayerType.KeepOutArea:
					return LogicalAreaSerializer.isValidObstacle(area);

				case LayerType.CostArea:
					return LogicalAreaSerializer.isValidCostArea(area);

				case LayerType.WeightedArea:
					return LogicalAreaSerializer.isValidWeightedArea(area);

				case LayerType.SpeedLimitArea:
					return LogicalAreaSerializer.isValidSpeedLimit(area);

				case LayerType.PlaySoundArea:
					return LogicalAreaSerializer.isValidPlaySound(area);

				case LayerType.QueueArea:
					return LogicalAreaSerializer.isValidQueue(area);

				case LayerType.StayOnPathArea:
					return LogicalAreaSerializer.isValidStayOnPath(area);

				default:
					console.log(`area type ${type} is invalid`);
					return false;
			}
		} catch (e) {
			console.log(`Error ${e} parsing area`);
			return false;
		}
	}

	static isValidObstacle(area: GeoJSONFeature): boolean {
		return true;
	}

	static isValidCostArea(area: GeoJSONFeature): boolean {
		const cost: string = ParseUtils.getRequiredField(area, 'properties.cost', 'number');

		return true;
	}

	static isValidWeightedArea(area: GeoJSONFeature): boolean {
		const n: string = ParseUtils.getRequiredField(area, 'properties.n', 'number');
		const ne: string = ParseUtils.getRequiredField(area, 'properties.ne', 'number');
		const e: string = ParseUtils.getRequiredField(area, 'properties.e', 'number');
		const se: string = ParseUtils.getRequiredField(area, 'properties.se', 'number');
		const s: string = ParseUtils.getRequiredField(area, 'properties.s', 'number');
		const sw: string = ParseUtils.getRequiredField(area, 'properties.sw', 'number');
		const w: string = ParseUtils.getRequiredField(area, 'properties.w', 'number');
		const nw: string = ParseUtils.getRequiredField(area, 'properties.nw', 'number');

		return true;
	}

	static isValidSpeedLimit(area: GeoJSONFeature): boolean {
		const name: string = ParseUtils.getRequiredField(area, 'properties.name', 'string');
		const speed: string = ParseUtils.getRequiredField(area, 'properties.maxVelocity', 'number');

		return true;
	}

	static isValidPlaySound(area: GeoJSONFeature): boolean {
		const name: string = ParseUtils.getRequiredField(area, 'properties.name', 'string');
		const sound: string = ParseUtils.getRequiredField(area, 'properties.soundName', 'string');

		return true;
	}

	static isValidQueue(area: GeoJSONFeature): boolean {
		const name: string = ParseUtils.getRequiredField(area, 'properties.name', 'string');
		const queueName: string = ParseUtils.getRequiredField(area, 'properties.queueName', 'string');

		return true;
	}

	static isValidStayOnPath(area: GeoJSONFeature): boolean {
		const name: string = ParseUtils.getRequiredField(area, 'properties.name', 'string');

		return true;
	}
}
