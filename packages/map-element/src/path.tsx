/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useContext } from 'react';

import { MapFeatureProps } from './map';
import { noopScale, ViewContext } from './map/view';

export interface PathProps extends MapFeatureProps {
	vertices: number[][];
}

export const Path = ({ vertices = [], scalingFn: scaleFn = noopScale }: PathProps) => {
	const { viewScale } = useContext(ViewContext);
	let path = '';
	if (vertices.length > 2) {
		path += `M${vertices[0][0]} ${vertices[0][1]}`;
		for (let i = 1; i < vertices.length; i++) {
			path += ` L${vertices[i][0]} ${vertices[i][1]}`;
		}
	}
	return (
		<path
			d={path}
			stroke="#1a56a0"
			strokeWidth={0.1 * scaleFn(viewScale())}
			fill="none"
			stroke-dasharray="0.25"
		/>
	);
};
