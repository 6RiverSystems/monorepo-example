/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { MarkerProps, Marker } from './map/marker';

/** This is the actual chuck size in meters */
export const enum MfpDimensions {
	width = 0.6219,
	length = 1.0182,
}

export interface ChuckProps extends MarkerProps {
	id?: string;
	name?: string;
	picker?: boolean;
}

const styles = css`
	overflow: visible;
`;

const pickerStyles = css`
	stroke-width: 0;
	stroke: #000;
	fill: #555;
`;

function getRotation(orientation: number): number {
	let rotation = orientation + 90;

	// sanity check: 0 <= orientation <= 360
	if (rotation > 360) {
		rotation -= 360;
	} else if (rotation < 0) {
		rotation += 360;
	}
	rotation = Math.round(rotation);
	return rotation;
}

export const Picker = () => {
	return (
		<circle
			cx={MfpDimensions.width / 2}
			cy={(MfpDimensions.length + MfpDimensions.length / 2) * (5 / 6)}
			r={MfpDimensions.length / 5}
			css={pickerStyles}
		/>
	);
};

export const Chuck = ({ picker = false, id, name, ...props }: ChuckProps) => {
	const totalWidth = MfpDimensions.width;
	const totalLength = picker
		? MfpDimensions.length + MfpDimensions.length / 2
		: MfpDimensions.length;

	/* eslint-disable max-len*/
	return (
		<Marker {...props} size={{ x: 1, y: 1 }}>
			<svg viewBox={`0 0 ${totalWidth} ${totalLength}`} css={styles} width="1" height="1">
				{picker ? <Picker /> : null}
				<g
					fill="none"
					strokeWidth="2px"
					stroke="#555"
					fillRule="evenodd"
					transform={`scale(${MfpDimensions.width / 20},${MfpDimensions.length / 40})`}
				>
					<path
						className="mfp-fill"
						fill="#D8D8D8"
						d="m0.9013,3.08058c2.07993,-2.05372 5.11283,-3.08058 9.0987,-3.08058c3.98584,0 7.01873,1.02684 9.09867,3.08054c0.57908,0.57176 0.90133,1.32606 0.90133,2.10972l0,29.14419c0,1.70378 -1.49239,3 -3.33333,3l-13.33333,0c-1.84094,0 -3.33333,-1.3812 -3.33333,-3l0,-29.14416c-0.00001,-0.78367 0.32223,-1.53796 0.9013,-2.10972z"
					/>
					<rect
						className="mfp-fill"
						fill="#B9B9B9"
						height="7.19828"
						id="svg_3"
						rx="2"
						width="14.36"
						x="2.82"
						y="32.73572"
					/>
				</g>
			</svg>
		</Marker>
	);
	/* eslint-enable max-len*/
};
