/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { MapStackData, MapStack } from '@sixriver/map-io';
import { useRef } from 'react';

import { LogicalMap } from './logical-map';
import { Bounds, ViewTransform, ViewContext } from './view';
import { getTransformFromZoom, getViewScale, useMapStack } from './map-utils';
import { MapFeatureProps, LogicalMapProps } from '../map';
import { ControlProps } from '../controller/use-controller';

export interface StaticMapProps extends LogicalMapProps {
	mapStack: MapStackData | MapStack;
	zoom?: Bounds | ViewTransform;
	children?: (
		| React.ReactElement<MapFeatureProps | ControlProps> // TODO: filter out control props
		| (number | null | boolean | undefined)
	)[];
}

const styles = css`
	width: 100%;
	height: 100%;

	svg {
		display: inline-block;
		box-sizing: content-box;

		width: 100%;
		height: 100%;
	}
`;

/**
 * Renders the `LogicalMap`, applies transformation and renders children on top.
 * Children like `Markers` and `Paths`, all get the transformation property via: `MapChildProps`
 */
export const StaticMap = ({
	mapStack,
	zoom = { scale: 1, translate: { x: 0, y: 0 } },
	children,
	...props
}: StaticMapProps) => {
	const svgRef = useRef<SVGSVGElement | null>(null);

	const { mapData, bounds } = useMapStack(mapStack);

	const boundsWidth = bounds.x2 - bounds.x1;
	const boundsHeight = bounds.y2 - bounds.y1;

	const transform: ViewTransform = getTransformFromZoom(zoom, bounds);
	const viewScale = getViewScale(svgRef.current, transform.scale);

	const transformAttribute = `scale(${transform.scale}) translate(${transform.translate.x}, ${transform.translate.y})`;
	return (
		<ViewContext.Provider
			value={{ translate: transform.translate, scale: transform.scale, bounds, viewScale }}
		>
			<div css={styles}>
				<svg
					ref={svgRef}
					viewBox={`${bounds.x1} ${bounds.y1} ${boundsWidth} ${boundsHeight}`}
					preserveAspectRatio="xMidYMid meet"
				>
					<rect
						x={bounds.x1}
						y={bounds.y1}
						width={boundsWidth}
						height={boundsHeight}
						fill="white"
					/>
					<g className="flip-axis" transform={`translate(0,${bounds.y2 + bounds.y1}) scale(1,-1)`}>
						<g
							className="view-transform"
							transform-origin={`${(bounds.x1 + bounds.x2) / 2} ${(bounds.y1 + bounds.y2) / 2}`}
							transform={transformAttribute}
						>
							<LogicalMap mapData={mapData} {...props} />
							{children}
						</g>
					</g>
				</svg>
			</div>
		</ViewContext.Provider>
	);
};
