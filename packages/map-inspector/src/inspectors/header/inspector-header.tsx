/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MapFeature } from '@sixriver/map-io';
import { useContext } from 'react';

import { idStyle, typeStyle, countStyle } from '../inspector-style';
import { FormContext } from '../form-context';

/**
 * Provides each inspector a title and id
 */
const title: { [key in MapFeature]: string } = {
	workflowPoint: 'Workflow Point',
	aisle: 'Aisle',
	costArea: 'Local Cost Area',
	impassable: 'Impassable',
	keepOut: 'Keep Out',
	queue: 'Queue',
	stayOnPath: 'Stay-On-Path',
	speedLimit: 'Speed Limit',
	weightedArea: 'Weighted Area',
	area: 'Area',
	mfpDisplay: 'mfpDisplay',
	playSoundArea: 'playSoundArea',
	occupancyGrid: 'occupancyGrid',
};

export function InspectorHeader() {
	const {
		fields: { type, id },
		count,
		multi,
	} = useContext(FormContext);

	if (!multi) {
		return (
			<div>
				<h1 css={typeStyle}>{title[type.value]}</h1>
				<p css={idStyle}>{id.value}</p>
			</div>
		);
	}
	return (
		<div>
			<h1 css={typeStyle}>{title[type.value]}</h1>
			<p css={countStyle}>{`Selected ${count} features`}</p>
		</div>
	);
}
