import { Aisle } from '../class/mapstack/Aisle';
import { CostArea } from '../class/mapstack/CostArea';
import { ImpassableArea } from '../class/mapstack/ImpassableArea';
import { KeepOutArea } from '../class/mapstack/KeepOutArea';
import { QueueArea } from '../class/mapstack/QueueArea';
import { SpeedLimitArea } from '../class/mapstack/SpeedLimitArea';
import { StayOnPathArea } from '../class/mapstack/StayOnPathArea';
import { WeightedArea } from '../class/mapstack/WeightedArea';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';

/**
 * MapFeature is a synthetic type that matches all classes that represent map features. It is equivalent to Layer but
 * without MfpDisplay, which is not technically a map feature.
 */
export type MapFeature =
	| Aisle
	| CostArea
	| ImpassableArea
	| KeepOutArea
	| QueueArea
	| StayOnPathArea
	| SpeedLimitArea
	| WeightedArea
	| WorkflowPoint;
