/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { AreasState, MapFeatureProperties } from '@sixriver/map-io';

/**
 * Creates a styleClass that is applied to an area feature svg element.
 * For most areas it's sufficient to append the type to the styleClass, but for weighted areas we make a distinction
 * based on the cardinal direction.
 */
function areaClassName(properties: MapFeatureProperties): string {
	if (properties.type === 'weightedArea') {
		const cardinals = ['north', 'south', 'east', 'west'];
		const cardinal: string = cardinals.reduce((a, cd) => (properties[cd[0]] > 0 ? (a = cd) : a));
		return 'area stack-weighted-' + cardinal;
	} else {
		return 'area stack-' + properties.type.toLowerCase();
	}
}
export function Area({ properties, bounds, tag = '' }: AreasState & { tag: string }) {
	const [[y1, x1], [y2, x2]] = bounds;
	const className = areaClassName(properties);

	return (
		<rect
			data-tag={properties.id}
			className={`${className} ${tag}`}
			vectorEffect="non-scaling-stroke"
			x={x1}
			y={y1}
			width={x2 - x1}
			height={y2 - y1}
		></rect>
	);
}
