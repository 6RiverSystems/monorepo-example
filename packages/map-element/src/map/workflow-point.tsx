/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { WorkflowPointState } from '@sixriver/map-io';

export function WorkflowPoint({
	properties: { orientation: o, id },
	position: [x, y],
	tag = '',
}: WorkflowPointState & { tag: string }) {
	/* eslint-disable max-len*/
	return (
		<g data-tag={id} transform={`translate(${x},${y}) rotate(${o}) scale(0.04)`}>
			<path
				className={'stack-workflow-point ' + tag}
				transform={`translate(-12,-12)`}
				d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
				stroke="#000"
			/>
		</g>
	);
	/* eslint-enable max-len*/
}
