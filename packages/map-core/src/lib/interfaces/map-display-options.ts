import { LayerType } from './layer';

export enum DisplayOptions {
	Position = 'position',
	QueueDepthToggleEnabled = 'queueDepthToggleEnabled',
	WorkflowStatusToggleEnabled = 'workflowStatusToggleEnabled',
	StaleMfpExpiration = 'staleMfpExpiration',
	DwellMfpDuration = 'dwellMfpDuration',
	EditPalette = 'editPalette',
	LayerControl = 'layerControl',
	MfpStateLegend = 'mfpStateLegend',
	MaxZoom = 'maxZoom',
	/* LayerType.Aisle */
	Aisle = 'aisle',
	/* LayerType.Area */
	Area = 'area',
	/* LayerType.CostArea */
	CostArea = 'costArea',
	/* LayerType.ImpassableArea */
	ImpassableArea = 'impassable',
	/* LayerType.KeepOutArea */
	KeepOutArea = 'keepOut',
	/* LayerType.MfpDisplay */
	MfpDisplay = 'mfpDisplay',
	/* LayerType.PlaySoundArea */
	PlaySoundArea = 'playSoundArea',
	/* LayerType.QueueArea */
	QueueArea = 'queue',
	/* LayerType.StayOnPathArea */
	StayOnPathArea = 'stayOnPath',
	/* LayerType.SpeedLimitArea */
	SpeedLimitArea = 'speedLimit',
	/* LayerType.WeightedArea */
	WeightedArea = 'weightedArea',
	/* LayerType.WorkflowPoint */
	WorkflowPoint = 'workflowPoint',
	/* LayerType.OccupancyGrid */
	OccupancyGrid = 'occupancyGrid',
	/** Modern renderer */
	NextMode = 'nextMode',
	/* LayerType.'simulatedObject' */
	SimulatedObject = 'simulatedObject',
}

export type DisplayOptionValue = MapLayerOptionConfig | string | number | boolean;

export interface MapLayerOptionConfig {
	/** When true, selected state will be shown on click. */
	selectable: boolean;
	/** When true, detail component will be opened on click. */
	inspectable: boolean;
	/** When true, all properties will be editable.  */
	editable: boolean;
	/** When true, layer will be movable */
	movable: boolean;
}

export const editableLayer: MapLayerOptionConfig = {
	selectable: true,
	inspectable: true,
	editable: true,
	movable: true,
};

export const readOnlyLayer: MapLayerOptionConfig = {
	selectable: true,
	inspectable: true,
	editable: false,
	movable: false,
};

export type DisplayOptionsMap = Map<DisplayOptions, DisplayOptionValue>;
export type DisplayOptionsObject = { [key in DisplayOptions]: DisplayOptionValue };

/**
 * Allow editing of the map.
 * New layers can be created, modified and deleted. Edit toolbar is available to create new layers.
 * Do not show MFPs.
 */
export const editorOptions = new Map<DisplayOptions, DisplayOptionValue>([
	[DisplayOptions.MaxZoom, 10],
	[DisplayOptions.OccupancyGrid, true],
	[DisplayOptions.EditPalette, 'editor'],
	[DisplayOptions.LayerControl, true],
	[DisplayOptions.MfpDisplay, false],
	[DisplayOptions.Aisle, editableLayer],
	[DisplayOptions.WorkflowPoint, editableLayer],
	[DisplayOptions.KeepOutArea, editableLayer],
	[DisplayOptions.CostArea, editableLayer],
	[DisplayOptions.QueueArea, editableLayer],
	[DisplayOptions.StayOnPathArea, editableLayer],
	[DisplayOptions.SpeedLimitArea, editableLayer],
	[DisplayOptions.WeightedArea, editableLayer],
	[DisplayOptions.ImpassableArea, editableLayer],
	[DisplayOptions.Position, true],
]);

/**
 * Show MFPs and all layers. Allow readonly viewing details of all map features.
 */
export const powerUserOptions = new Map<DisplayOptions, DisplayOptionValue>([
	[DisplayOptions.MaxZoom, 7],
	[DisplayOptions.OccupancyGrid, true],
	[DisplayOptions.EditPalette, 'powerUser'],
	[DisplayOptions.MfpDisplay, { ...readOnlyLayer, movable: true }],
	[DisplayOptions.MfpStateLegend, true],
	[DisplayOptions.Aisle, readOnlyLayer],
	[DisplayOptions.WorkflowPoint, readOnlyLayer],
	[DisplayOptions.KeepOutArea, readOnlyLayer],
	[DisplayOptions.CostArea, readOnlyLayer],
	[DisplayOptions.QueueArea, readOnlyLayer],
	[DisplayOptions.StayOnPathArea, readOnlyLayer],
	[DisplayOptions.SpeedLimitArea, readOnlyLayer],
	[DisplayOptions.WeightedArea, readOnlyLayer],
	[DisplayOptions.ImpassableArea, { ...readOnlyLayer, selectable: false, inspectable: false }],
	[DisplayOptions.SimulatedObject, { ...editableLayer, movable: false }],
	[DisplayOptions.Position, true],
]);

/**
 * Show MFPs on the map but hide most layers and prevent viewing details of map features.
 */
export const liveViewOptions = new Map<DisplayOptions, DisplayOptionValue>([
	[DisplayOptions.MaxZoom, 7],
	[DisplayOptions.OccupancyGrid, false],
	[DisplayOptions.MfpDisplay, { ...readOnlyLayer, inspectable: true }],
	[DisplayOptions.MfpStateLegend, false],
	[DisplayOptions.QueueDepthToggleEnabled, false],
	[DisplayOptions.WorkflowStatusToggleEnabled, false],
	[DisplayOptions.DwellMfpDuration, 1800],
	[DisplayOptions.StaleMfpExpiration, 120],
	[DisplayOptions.Aisle, false],
	[DisplayOptions.WorkflowPoint, { ...readOnlyLayer, inspectable: true }],
	[DisplayOptions.KeepOutArea, false],
	[DisplayOptions.CostArea, false],
	[DisplayOptions.QueueArea, false],
	[DisplayOptions.StayOnPathArea, false],
	[DisplayOptions.SpeedLimitArea, false],
	[DisplayOptions.WeightedArea, false],
	[DisplayOptions.ImpassableArea, { ...readOnlyLayer, selectable: false, inspectable: false }],
]);
