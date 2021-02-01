import { ConnectivityMatrix } from './connectivity-matrix';

export type MapFeature =
	| 'aisle'
	| 'area'
	| 'costArea'
	| 'impassable'
	| 'keepOut'
	| 'mfpDisplay'
	| 'playSoundArea' // deprecated
	| 'queue'
	| 'stayOnPath'
	| 'speedLimit'
	| 'weightedArea'
	| 'workflowPoint'
	| 'occupancyGrid';

export type uuid = string;
export type Point = [number, number];
export type Bounds = [Point, Point];

export interface MapFeatureProperties {
	readonly id: uuid;
	readonly name: string;
	readonly type: MapFeature;
}

export type AreaProperties = MapFeatureProperties;

export interface MapFeatureState {
	readonly properties: MapFeatureProperties;
}

export interface WorkflowPointProperties extends MapFeatureProperties {
	readonly type: 'workflowPoint';
	readonly target?:
		| 'meetingPoint'
		| 'induct'
		| 'userDirectedInduct'
		| 'takeoff'
		| 'takeoffDestination'
		| 'takeoffException'
		| 'postCharge'
		| 'preCharge'
		| 'replenInduct'
		| 'replenMeetingPoint'
		| 'replenTakeoff'
		| 'postPick'
		| 'generic';
	readonly object: 'vertex';
	readonly orientation: number;
	readonly labels: string[];
	readonly workflowOptions: string[];
}

export interface WorkflowPointState extends MapFeatureState {
	readonly properties: WorkflowPointProperties;
	readonly position: Point;
}

export interface AisleProperties extends MapFeatureProperties {
	readonly type: 'aisle';
	readonly object: 'aisle';
	readonly directed: boolean;
	readonly labels: string[];
}

export interface AisleState extends MapFeatureState {
	readonly properties: AisleProperties;
	readonly points: Point[];
}

export interface AreaState<T extends MapFeatureProperties = MapFeatureProperties>
	extends MapFeatureState {
	readonly properties: T;
	readonly bounds: Bounds;
}

export interface CostAreaProperties extends AreaProperties {
	readonly type: 'costArea';
	readonly cost: number;
}

export type CostAreaState = AreaState<CostAreaProperties>;

export interface ImpassableAreaProperties extends AreaProperties {
	readonly type: 'impassable';
}

export type ImpassableAreaState = AreaState<ImpassableAreaProperties>;

export interface KeepOutAreaProperties extends AreaProperties {
	readonly type: 'keepOut';
}

export type KeepOutAreaState = AreaState<KeepOutAreaProperties>;

/** @deprecated **/
export interface PlaySoundAreaProperties extends AreaProperties {
	readonly type: 'playSoundArea';
}

/** @deprecated **/
export type PlaySoundAreaState = AreaState<PlaySoundAreaProperties>;

export interface QueueAreaProperties extends AreaProperties {
	readonly type: 'queue';
	readonly queueName: string;
}

export type QueueAreaState = AreaState<QueueAreaProperties>;

export interface StayOnPathAreaProperties extends AreaProperties {
	readonly type: 'stayOnPath';
}

export type StayOnPathAreaState = AreaState<StayOnPathAreaProperties>;

export interface SpeedLimitAreaProperties extends AreaProperties {
	readonly type: 'speedLimit';
	readonly maxVelocity: number;
}

export type SpeedLimitAreaState = AreaState<SpeedLimitAreaProperties>;

export interface WeightedAreaProperties extends AreaProperties {
	readonly type: 'weightedArea';
	readonly n: number;
	readonly ne: number;
	readonly e: number;
	readonly se: number;
	readonly s: number;
	readonly sw: number;
	readonly w: number;
	readonly nw: number;
}

export type WeightedAreaState = AreaState<WeightedAreaProperties>;

export type AreasState =
	| CostAreaState
	| ImpassableAreaState
	| KeepOutAreaState
	| PlaySoundAreaState
	| QueueAreaState
	| StayOnPathAreaState
	| SpeedLimitAreaState
	| WeightedAreaState;

export interface MapStackData {
	readonly type: 'map-stack-data';
	readonly name: string;
	readonly buildNumber: number;
	readonly resolution: number;
	readonly origin: number[];

	readonly workflowPoints: WorkflowPointState[];
	readonly aisles: AisleState[];
	readonly areas: AreasState[];

	occupancyGridImage: unknown;
	occupancyGridBlob: Blob;

	readonly baseFileName: string;
	connectivityMatrix: ConnectivityMatrix;
}
