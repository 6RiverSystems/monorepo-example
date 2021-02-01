/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { MapStackData } from '@sixriver/map-io';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

import { Area } from './area';
import { Aisle, ArrowHead } from './aisle';
import { WorkflowPoint } from './workflow-point';
import { Bounds } from './view';

export type TagList = { [id: string]: 'selected' | 'error' | 'disabled' };

export interface LogicalMapProps {
	mapData: MapStackData;
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

type LayerGroup = { [key: string]: JSX.Element[] };

function createLayers(
	map: MapStackData,
	filteredLayers: { [key: string]: boolean },
	tags: TagList,
): LayerGroup {
	const layers: LayerGroup = map.areas
		.filter(area => filteredLayers[area.properties.type])
		.reduce((layerGroup, area) => {
			const array = layerGroup[area.properties.type] || [];
			array.push(<Area tag={tags[area.properties.id]} {...area} key={area.properties.id} />);
			layerGroup[area.properties.type] = array;
			return layerGroup;
		}, {});

	layers.aisle = map.aisles.map(aisle => (
		<Aisle tag={tags[aisle.properties.id]} {...aisle} key={aisle.properties.id} />
	));

	layers.workflowPoint = map.workflowPoints.map(workflowPoint => (
		<WorkflowPoint
			tag={tags[workflowPoint.properties.id]}
			{...workflowPoint}
			key={workflowPoint.properties.id}
		/>
	));
	return layers;
}

const styles = css`
	.area {
		stroke-width: 0;
		&.selected {
			stroke-width: 2;
			stroke: rgb(66, 170, 244);
			fill: rgb(66, 170, 244, 0.5);
			z-index: 9999;
		}

		&.error {
			stroke-width: 5;
			stroke: rgb(196, 12, 43);
			fill: #f44260;
			z-index: 9999;
		}
	}

	.stack-aisle {
		stroke: rgb(51, 136, 255);
		stroke-width: 2;

		&.selected {
			stroke-width: 3;
			stroke: rgb(66, 170, 244);
			z-index: 9999;
		}

		&.error {
			stroke-width: 5;
			stroke: rgb(196, 12, 43);
			fill: #f44260;
			z-index: 9999;
		}
	}

	#stack-aisle-arrow {
		fill: rgb(51, 136, 255);
		stroke: rgb(51, 136, 255);
		stroke-width: 0;
	}

	.stack-impassable {
		stroke: transparent;
		stroke-width: 0;
		fill: #c4c3c4;
		fill-opacity: 1;
	}

	.stack-simulated-object {
		stroke: transparent;
		stroke-width: 0;
		fill: rgb(15, 15, 15);
		fill-opacity: 0.7;
	}

	.stack-costarea {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #ffbcbe;
	}

	.stack-keepout {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #ffef48;
	}

	.stack-queue {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #1e178d;
	}

	.stack-speedlimit {
	}

	.stack-stayonpath {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #df0d67;
	}

	.stack-weighted {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #f0f000;
	}

	.stack-weighted-north {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #ffc439;
	}

	.stack-weighted-south {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #54ff39;
	}

	.stack-weighted-east {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #b900ff;
	}

	.stack-weighted-west {
		stroke: #fff;
		fill-opacity: 0.7;
		fill: #393bff;
	}

	.stack-workflow-point {
		&.error {
			fill: rgb(244, 66, 96);
			stroke-width: 2;
			fill: #f44260c7;
			stroke: #f44260c7;
			z-index: 9999;
		}

		&.selected {
			stroke: rgb(66, 170, 244);
			stroke-width: 2;
			fill: #42aaf4c7;
			stroke: #42aaf4c7;
			z-index: 9999;
		}
	}
`;

/**
 * Renders the logical areas as the inner content of the svg map.
 */
const LogicalMap = ({
	mapData,
	showAisle,
	showCostArea,
	showKeepOutArea,
	showPlaySoundArea,
	showQueueArea,
	showStayOnPathArea,
	showSpeedLimitArea,
	showWeightedArea,
	showWorkflowPoint,
	tags,
}: LogicalMapProps) => {
	/** A lookup a table for determining if a layer type is showing */
	const filteredLayers = {
		costArea: showCostArea,
		keepOut: showKeepOutArea,
		playSoundArea: showPlaySoundArea,
		queue: showQueueArea,
		stayOnPath: showStayOnPathArea,
		speedLimit: showSpeedLimitArea,
		weightedArea: showWeightedArea,
		aisle: showAisle,
		workflowPoint: showWorkflowPoint,
		impassable: true,
	};
	/** create JSX elements for all the showing layers */
	const layers = createLayers(mapData, filteredLayers, tags || {});

	return (
		<g css={styles}>
			<defs>
				<ArrowHead />
			</defs>

			<g className="impassable">{layers.impassable}</g>
			{showCostArea && <g className="cost-areas">{layers.costArea}</g>}
			{showKeepOutArea && <g className="keep-out-areas">{layers.keepOut}</g>}
			{showPlaySoundArea && <g className="play-sound-areas">{layers.playSoundArea}</g>}
			{showQueueArea && <g className="queue-areas">{layers.queue}</g>}
			{showStayOnPathArea && <g className="stay-on-path-areas">{layers.stayOnPath}</g>}
			{showSpeedLimitArea && <g className="speed-limit-areas">{layers.speedLimit}</g>}
			{showWeightedArea && <g className="weighted-areas">{layers.weightedArea}</g>}
			{showAisle && <g className="aisles">{layers.aisle}</g>}
			{showWorkflowPoint && <g className="workflow-points">{layers.workflowPoint}</g>}
		</g>
	);
};

/**
 * Memoize the rendered LogicalMap to help with performance.
 * The LogicalMap rarely changes, so we memoize it to avoid having to execute the whole rendering code every time an
 * ancestor re-renders. The comparison function looks at the build number (generationId) for the whole map, and the
 * tags for selection and errors.
 **/
const MemoizedLogicalMap = memo(
	LogicalMap,
	(prev, next) => prev.mapData.name === next.mapData.name && isEqual(prev.tags, next.tags),
);
export { MemoizedLogicalMap as LogicalMap };
