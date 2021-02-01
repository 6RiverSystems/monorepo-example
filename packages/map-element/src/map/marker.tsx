/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { PropsWithChildren, useContext } from 'react';

import { MapFeatureProps } from '../map';
import { noopScale, ViewContext } from './view';

export interface MarkerProps extends MapFeatureProps {
	x?: number;
	y?: number;
	orientation?: number;
	/** The size of the Marker's content, this is important for rotating the content around the center. */
	size?: { x: number; y: number };
	/** Time in milliseconds to animate the transform transition. */
	animationDuration?: number;
}

/**
 * A Wrapper component for an element that need to be embedded in the map's transformation matrix.
 * Handles positioning using x, y and orientation. If desired, it can animate the transition to create smooth movement.
 * @example
 * // Using a Marker with an SVG part:
 * export const Target = (props: MarkerProps) => {
 *    const width = 1;
 *    const height = 0.5;
 *    return (
 *	      <Marker {...props} size={{ x: width, y: height}}>
 *	  	    <rect width={width} height={height} />
 *	      </Marker>
 *	  );
 * };
 *
 * // Using a Marker with an SVG element:
 * export const Target = (props: MarkerProps) => {
 *    return (
 *        <Marker {...props} size={{x: 1, y: 1}}>
 *            <svg viewBox="0 0 100 50" width="1" height="1">
 *            ...
 *            </svg>
 *        </Marker>
 *	  );
 * };
 */
export const Marker = ({
	x = 0,
	y = 0,
	orientation = 0,
	size = { x: 1, y: 1 },
	animationDuration,
	children,
	scalingFn = noopScale,
}: PropsWithChildren<MarkerProps>) => {
	const { viewScale } = useContext(ViewContext);
	const scale = viewScale ? scalingFn(viewScale()) : 1;

	return (
		<g
			transform={
				`translate(${x}, ${y}) ` +
				`scale(${scale}, -${scale}) ` +
				`translate(${-size.x / 2}, ${-size.y / 2}) ` +
				`rotate(${-orientation},${size.x / 2},${size.y / 2})`
			}
			style={
				animationDuration && {
					transition: `transform ${animationDuration}ms linear`,
					willChange: 'transform',
				}
			}
		>
			{children}
		</g>
	);
};
