/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { MarkerProps, Marker } from './map/marker';

export const Goal = (props: MarkerProps) => {
	/* eslint-disable max-len*/
	return (
		<Marker {...props}>
			<svg width="1" height="1" viewBox="0 0 49.6 82.8">
				<defs />
				<circle cx={25} cy={20} r={15} fill="#fff" />
				<circle cx={24.8} cy={58} r={24.8} fill="#fff" />
				<path
					fill="#1a56a0"
					fillRule="evenodd"
					d="M24.8 82.8A24.8 24.8 0 017.8 40l3.3 6.5a17.9 17.9 0 1027.3 0l3.4-6.5a24.8 24.8 0 01-17 42.8zM42 33L24.8 66.1l-17.3-33a20.9 20.9 0 01-3.9-12 21.2 21.2 0 0142.3 0A20.9 20.9 0 0142.1 33zM24.8 10.8A10.3 10.3 0 1035 21.1a10.3 10.3 0 00-10.3-10.3z"
				/>
			</svg>
		</Marker>
	);
	/* eslint-enable max-len*/
};
