import {
	AisleMask,
	AvailableSpace,
	IAvMfpData,
	IJob,
	IMapPointData,
	IUserTask,
	IUtbData,
	Workspace,
	WorkspaceReservation,
	ZoneSelection,
} from '@sixriver/cfs_models';
import { FaultState, Fault, DeviceClass } from '@sixriver/mfp_lib_js/browser';

import { Pose } from './pose';

// is this UserTaskType???
export const enum Phase {
	BOOTING = 'booting',
	INDUCT = 'induct',
	OFFLINE = 'offline',
	PREPICK = 'prepick',
	PICKING = 'picking',
	RESTAGE = 'restage',
	TAKEOFF = 'takeoff',
	CHARGE = 'charge',
	CHARGED = 'charged',
	USER_DIRECTED_INDUCT = 'userdirectedinduct',
	PACKOUT = 'packout',
}

export const enum WorkState {
	UNKNOWN = 'UNKNOWN',
	AVAILABLE = 'AVAILABLE',
	ALLOCATED = 'ALLOCATED',
	OFFLINE = 'OFFLINE',
}

export class UserTaskBatch implements IUtbData {
	// Properties required to implement IUtbData
	mfpId: string;
	nextPhase: string;
	loginRequired: boolean;
	handoff: boolean;
	jobs: IJob[];
	tasks: IUserTask[];

	workspaceReservations: any[];

	assetTypes: any;
	locations: any;

	data: {
		zoneSelection: ZoneSelection;
	};

	destination: any;
}

export const enum MotionState {
	IDLE = 'idle',
	TRAVELING = 'traveling',
	PAUSED = 'paused',
	CHARGING = 'charging',
	DOCKING = 'docking',
}

export const enum MfpDimensions {
	width = 0.6219,
	length = 1.0182,
}

export type FaultMap = { [key in FaultState]?: Fault };
export interface FieldUpdatedMap {
	[key: string]: number;
}

/**
 * TODO: there are 2 nearly identical mfp objects, MfpParams and Mfp.
 * MfpParams interface represents and interface for the serialized mfp data in the response from TC service.
 * Mfp class is used for the ui and is placed in the store. Using classes in the store is not recommended,
 * because it is hard to ensure immutability. We should try to consolidate the objects or make a better
 * distinction. Mfp should be converted to an interface the next time we refactor the store.
 */

export interface MfpParams {
	faults?: FaultMap;
	fieldUpdated?: FieldUpdatedMap;
	id?: string;
	motionState?: MotionState;
	name?: string;
	pose?: Pose | null;
	updated?: Date;
	deviceClass?: DeviceClass;

	// Properties required to implement IAvMfpData
	currentPose?: IMapPointData;
	jobSlotAssignments?: any[];
	phase?: Phase;
	state?: WorkState;
	taskBatches?: IUtbData[];

	// Properties required to implement IMfp
	aisleMask?: AisleMask;
	batteryLevel?: number;
	takeoffDestination?: string;
	userId?: string;
	workspaceReservations?: WorkspaceReservation[];
	workspaces?: Workspace[];
	availableWorkspaces?: () => { availableSpaces: AvailableSpace[]; errors: any[] };
}

export class Mfp implements IAvMfpData {
	faults: FaultMap;
	fieldUpdated: FieldUpdatedMap;
	id: string;
	motionState: MotionState;
	name: string;
	pose: Pose | null;
	updated: Date;
	deviceClass: DeviceClass;

	// Properties required to implement IAvMfpData
	currentPose: IMapPointData;
	jobSlotAssignments: any[];
	phase: Phase;
	state: WorkState;
	taskBatches: IUtbData[];

	// Properties required to implement IMfp
	aisleMask: AisleMask;
	batteryLevel?: number;
	takeoffDestination: string;
	userId: string;
	workspaceReservations: WorkspaceReservation[];
	workspaces: Workspace[];

	/**
	 * The "parameter object" pattern is used to allow instance creation with only a subset of fields
	 */
	constructor({
		faults = {},
		fieldUpdated = {},
		id = '',
		motionState = MotionState.IDLE,
		name = '',
		pose = <Pose | null>null,
		updated = new Date(),
		deviceClass = DeviceClass.MFP,

		// Properties required to implement IAvMfpData
		currentPose = <IMapPointData>null,
		jobSlotAssignments = <any[]>[],
		phase = <Phase>null,
		state = <WorkState>null,
		taskBatches = <UserTaskBatch[]>[],

		// Properties required to implement IMfp
		aisleMask = <AisleMask>null,
		batteryLevel = <number>null,
		takeoffDestination = <string>null,
		userId = <string>null,
		workspaceReservations = <WorkspaceReservation[]>null,
		workspaces = <Workspace[]>null,
		availableWorkspaces = <() => { availableSpaces: AvailableSpace[]; errors: any[] }>null,
	}: MfpParams) {
		this.aisleMask = aisleMask;
		this.availableWorkspaces = availableWorkspaces;
		this.batteryLevel = batteryLevel;
		this.currentPose = currentPose;
		this.faults = faults;
		this.fieldUpdated = fieldUpdated;
		this.id = id;
		this.jobSlotAssignments = jobSlotAssignments;
		this.motionState = motionState;
		this.name = name;
		this.phase = phase;
		this.pose = pose;
		this.state = state;
		this.takeoffDestination = takeoffDestination;
		this.taskBatches = taskBatches;
		this.updated = updated;
		this.deviceClass = deviceClass;
		this.userId = userId;
		this.workspaceReservations = workspaceReservations;
		this.workspaces = workspaces;
		this.fieldUpdated = fieldUpdated;
	}

	/**
	 * No-op (required to implement IMfp)
	 */
	availableWorkspaces() {
		return { availableSpaces: <AvailableSpace[]>null, errors: <any[]>null };
	}

	getName(): string {
		return this.name || this.id;
	}

	isChuck(): boolean {
		return !this.deviceClass || this.deviceClass === DeviceClass.MFP;
	}

	isCharging(): boolean {
		return this.motionState === MotionState.CHARGING;
	}

	isDocking(): boolean {
		return this.motionState === MotionState.DOCKING;
	}

	isIdle(): boolean {
		return this.motionState === MotionState.IDLE;
	}

	isTraveling(): boolean {
		return this.motionState === MotionState.TRAVELING;
	}

	isPaused(): boolean {
		return this.motionState === MotionState.PAUSED;
	}

	isPicking(): boolean {
		return this.phase === Phase.PICKING;
	}

	hasFaults(): boolean {
		return Boolean(this.faults && Object.keys(this.faults).length);
	}

	isDwelling(dwellTimeSeconds: number): boolean {
		return dwellTimeSeconds > 0 && this.getTimeSinceLastMoved() > dwellTimeSeconds;
	}

	isOffline(offlineTimeSeconds: number): boolean {
		return (
			!this.fieldUpdated['pose'] ||
			!this.pose ||
			(offlineTimeSeconds > 0 &&
				this.updated &&
				this.getTimeSinceLastUpdated() > offlineTimeSeconds)
		);
	}

	isLost(): boolean {
		return Boolean(
			!this.fieldUpdated['pose'] ||
			!this.pose || // never had a pose set from ROS
			(Math.round(this.pose.x) === 0 && Math.round(this.pose.y) === 0) || // does not have a valid pose
				(this.hasFaults() && this.faults[FaultState.NAVIGATION_LOST]),
		); // has a navigation lost faults
	}

	getTimeSinceLastMoved(): number {
		const timeUpdated = (Date.now() - this.fieldUpdated['pose']) / 1000;
		return timeUpdated;
	}

	getTimeSinceLastUpdated(): number {
		const timeUpdated = (Date.now() - this.updated.getTime()) / 1000;
		return timeUpdated;
	}
}
