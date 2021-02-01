/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { MapStackData, MapStack } from '@sixriver/map-io';

import { Bounds, ViewTransform, ScalingFunction, ViewState } from './map/view';
import { StaticMap } from './map/static-map';
import { useController, ControlProps } from './controller/use-controller';
import { SelectionControl } from './controller/selection-control';
import { ZoomControl } from './controller/zoom-control';
import { PanControl } from './controller/pan-control';
import { ZoomService } from './services/zoom-service';
import { SelectionService } from './services/selection-service';
import { useMapStack, getTransformFromZoom } from './map/map-utils';

export interface MapProps extends LogicalMapProps {
	/** json representation of a map-stack */
	mapStack: MapStackData | MapStack;
	/** The rectangle that is viewed | the scale and translation */
	zoom?: Bounds | ViewTransform;
	/** Zoom with the mouse wheel or track pad */
	enableZoomControl?: boolean;
	/** Pan the map when clicking and dragging */
	enablePanControl?: boolean;
	/** Clicking on features will select it */
	enableSelectionControl?: boolean;
	/** Map children comply to the MapFeatureProps interface for positioning in the map's transformation matrix  */
	children?: (
		| React.ReactElement<MapFeatureProps | ControlProps>
		| (number | null | boolean | undefined)
	)[]; // Must allow these types for conditional rendering
}

export type TagList = { [id: string]: 'selected' | 'error' | 'disabled' };

export interface LogicalMapProps {
	showAisle?: boolean;
	showCostArea?: boolean;
	showKeepOutArea?: boolean;
	showPlaySoundArea?: boolean;
	showQueueArea?: boolean;
	showStayOnPathArea?: boolean;
	showSpeedLimitArea?: boolean;
	showWeightedArea?: boolean;
	showWorkflowPoint?: boolean;
	tags?: TagList;
}

/**
 * Props for a feature that gets embedded inside the map's transformation matrix.
 */
export interface MapFeatureProps {
	x?: number;
	y?: number;
	orientation?: number;
	/**
	 * A scale function can be provided to support non linear scaling
	 */
	scalingFn?: ScalingFunction;
}

/**
 * Renders the `LogicalMap`, applies transformation and renders children on top.
 * Children like `Markers` and `Paths`, all get the transformation property via: `MapChildProps`
 */
export const Map = ({
	mapStack,
	zoom = { scale: 1, translate: { x: 0, y: 0 } },
	children,
	enablePanControl,
	enableZoomControl,
	enableSelectionControl,
	...props
}: MapProps) => {
	const { mapData, bounds } = useMapStack(mapStack);
	if (!mapData) {
		return <div>Failed to load map stack</div>;
	}

	const initialViewState: ViewState = { ...getTransformFromZoom(zoom, bounds), bounds };
	const { Controller, zoomState, selectionState } = useController(
		initialViewState,
		ZoomService,
		SelectionService,
	);

	const selectedProps: TagList = selectionState.selection.reduce<TagList>(
		(obj, feature) => ((obj[feature] = 'selected'), obj),
		{},
	);

	return (
		<Controller>
			<StaticMap
				{...props}
				zoom={{ scale: zoomState.scale, translate: zoomState.center }}
				mapStack={mapData}
				tags={selectedProps}
			>
				{children}
			</StaticMap>
			{enableZoomControl && <ZoomControl />}
			{enablePanControl && <PanControl />}
			{enableSelectionControl && <SelectionControl />}
		</Controller>
	);
};
