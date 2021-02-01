/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { AisleState } from '@sixriver/map-io';

export function Aisle({ points, properties, tag = '' }: AisleState & { tag: string }) {
	const [[y1, x1], [y2, x2]] = points;
	const path = `M ${x1} ${y1} L ${x2} ${y2}`;
	return (
		<path
			data-tag={properties.id}
			vectorEffect="non-scaling-stroke"
			className={'stack-aisle ' + tag}
			d={path}
			markerEnd="url(#stack-aisle-arrow)"
		/>
	);
}

export function ArrowHead() {
	const size = 0.5;

	return (
		<marker
			id="stack-aisle-arrow"
			vectorEffect="non-scaling-stroke"
			viewBox={`0 0 ${size} ${size}`}
			markerWidth={size}
			markerHeight={size}
			refX={size * 0.3}
			refY={size / 2}
			orient="auto"
			markerUnits="userSpaceOnUse"
		>
			<path d={`M0,0 L0,${size} L${size},${size / 2} Z`}></path>
		</marker>
	);
}
