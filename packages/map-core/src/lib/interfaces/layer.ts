import { Aisle } from '../class/mapstack/Aisle';
import { CostArea } from '../class/mapstack/CostArea';
import { ImpassableArea } from '../class/mapstack/ImpassableArea';
import { KeepOutArea } from '../class/mapstack/KeepOutArea';
import { MfpDisplay } from '../class/mapstack/MfpDisplay';
import { OccupancyGrid } from '../class/mapstack/OccupancyGrid';
import { QueueArea } from '../class/mapstack/QueueArea';
import { SpeedLimitArea } from '../class/mapstack/SpeedLimitArea';
import { StayOnPathArea } from '../class/mapstack/StayOnPathArea';
import { WeightedArea } from '../class/mapstack/WeightedArea';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';
import { SimulatedObject } from '../class/mapstack/SimulatedObject';

/**
 * A Layer is a synthetic type that matches all classes that represent map layers.
 */
export type Layer =
	| Aisle
	| CostArea
	| ImpassableArea
	| KeepOutArea
	| QueueArea
	| StayOnPathArea
	| SpeedLimitArea
	| WeightedArea
	| WorkflowPoint
	| MfpDisplay
	| OccupancyGrid
	| SimulatedObject;

/**
 * It is necessary to store the LayerType inside each layer so that it can be detected in minified code.
 */
export enum LayerType {
	Aisle = 'aisle',
	Area = 'area',
	CostArea = 'costArea',
	ImpassableArea = 'impassable',
	KeepOutArea = 'keepOut',
	MfpDisplay = 'mfpDisplay',
	PlaySoundArea = 'playSoundArea',
	QueueArea = 'queue',
	StayOnPathArea = 'stayOnPath',
	SpeedLimitArea = 'speedLimit',
	WeightedArea = 'weightedArea',
	WorkflowPoint = 'workflowPoint',
	OccupancyGrid = 'occupancyGrid',
	SimulatedObject = 'simulatedObject',
}
