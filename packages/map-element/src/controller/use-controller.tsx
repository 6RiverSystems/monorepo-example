/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useRef, useEffect } from 'react';
import {
	ZoomService as ZoomServiceBase,
	SelectionService as SelectionServiceBase,
	ControllerStack,
	LayerOptions,
	MapPoint,
	DOMPoint,
} from '@sixriver/map-controller';

import { ViewState } from '../map/view';
import { ControllerContext } from './controller-context';
import { translate } from '../map/map-utils';
import { ZoomService } from '../services/zoom-service';
import { SelectionService } from '../services/selection-service';
import { useZoomService } from './use-zoom-service';
import { useSelectionService } from './use-selection-service';

const containerStyles = css`
	width: 100%;
	height: 100%;
`;

export interface ControlProps {}

/**
 * Gives a `StaticMap` the ability to use `Controllers` and attaches a `ControllerStack` to the map.
 * Custom ZoomServices and SelectionServices classes can be provided for any custom storage such as redux.
 **/
export const useController = <
	Z extends ZoomServiceBase = ZoomService,
	S extends SelectionServiceBase = SelectionService
>(
	viewState?: ViewState,
	ZoomServiceType?: new () => Z,
	SelectionServiceType?: new () => S,
) => {
	const stack = useRef(new ControllerStack()).current;
	const { service: zoomService, state: zoomState } = useZoomService(ZoomServiceType, viewState);
	const { service: selectionService, state: selectionState } = useSelectionService(
		SelectionServiceType,
	);

	/**
	 * Wraps a component with a `span` element that captures all the events, provides a ControllerContext.
	 */
	const Controller = useRef((props: React.PropsWithChildren<{}>) => {
		const containerRef = useRef<HTMLElement>(null);
		useEffect(() => {
			if (!stack.translate) {
				attachController(stack, containerRef.current, zoomService);
			}
		}, [stack]);

		return (
			<ControllerContext.Provider value={{ stack, zoomService, selectionService }}>
				<span css={containerStyles} ref={containerRef}>
					{props.children}
				</span>
			</ControllerContext.Provider>
		);
	}).current;

	return {
		Controller,
		zoomState,
		selectionState,
	};
};

/**
 * Find an ancestor with a 'data-tag' attribute and get the attribute value.
 * We usually tag the top level node with the feature's id. In the case that an untagged child was the event's target,
 * this loop will go up the ancestor tree until it finds a tagged node.
 */
function findTaggedAncestor(node: HTMLElement) {
	let id: string;
	while (node && !(id = node.getAttribute('data-tag'))) {
		node = node.parentElement;
	}
	return id ? { id } : undefined;
}

function attachController(
	stack: ControllerStack,
	container: HTMLElement,
	zoomService: ZoomServiceBase,
) {
	stack.install(container);

	/** Get a layer that has been clicked on */
	stack.getLayer = (event: Event, options: LayerOptions[] = []): { id: string } | undefined => {
		return findTaggedAncestor((event as any).target);
	};

	/** Translate a point from the document position to the position in the map */
	stack.translate = function(offset: DOMPoint): MapPoint {
		const svg: SVGSVGElement = this.root.querySelector('svg');
		return translate(offset, container, svg, {
			scale: zoomService.scale,
			translate: zoomService.translate,
		});
	}.bind(stack);
}
