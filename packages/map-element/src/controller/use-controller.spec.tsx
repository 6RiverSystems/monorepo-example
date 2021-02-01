import { render, wait, fireEvent } from '@testing-library/react';
import { assert } from 'chai';
import React, { useContext } from 'react';
import { parse, MapStack, MapStackData } from '@sixriver/map-io';
import sinon from 'sinon';

import { useController, ControlProps } from './use-controller';
import { StaticMap } from '../map/static-map';
import xpomem from '../../../../tools/test-fixtures/map-stack/xpomem.json';
import { SelectionControl } from './selection-control';
import { PanControl } from './pan-control';
import { ZoomControl } from './zoom-control';
import { ControllerContext } from './controller-context';
import { ZoomService } from '../services/zoom-service';
import { SelectionService } from '../services/selection-service';

const mapData: MapStackData = parse(xpomem as MapStack);

function MapFixture({ children }: React.PropsWithChildren<{}>) {
	const { Controller, zoomState } = useController(
		{
			scale: 1,
			bounds: {
				x1: 0,
				y1: 0,
				x2: 100,
				y2: 100,
			},
			translate: { x: 0, y: 0 },
		},
		ZoomService,
		SelectionService,
	);
	return (
		<Controller>
			<StaticMap
				mapStack={mapData}
				showWorkflowPoint
				zoom={{ scale: zoomState.scale, translate: zoomState.center }}
			/>
			{children}
		</Controller>
	);
}
describe('useController', () => {
	it('should render a map with a Controller successfully', () => {
		assert.doesNotThrow(() => render(<MapFixture></MapFixture>));
	});

	it('should attach to a ControllerStack when adding controls', async () => {
		const handleEventSpy = sinon.fake();

		function TestControl() {
			const { stack, zoomService } = useContext(ControllerContext);

			sinon.replace(stack, 'handleEvent', handleEventSpy);

			assert.isDefined(stack);
			assert.isDefined(zoomService);

			return null;
		}

		const { container } = render(
			<MapFixture>
				<ZoomControl />
				<PanControl />
				<SelectionControl />
				<TestControl />
			</MapFixture>,
		);
		fireEvent.mouseDown(container.children[0], { clientY: 10, clientX: 10, buttons: 1 });
		await wait();
		sinon.assert.calledOnce(handleEventSpy);
	});

	it('should zoom in when using the mouse wheel', async () => {
		let zoomService: ZoomService = null;
		function TestControl() {
			zoomService = useContext(ControllerContext).zoomService as ZoomService;
			return null;
		}

		const { container } = render(
			<MapFixture>
				<ZoomControl />
				<TestControl />
			</MapFixture>,
		);

		const scaleBefore = zoomService.scale;
		fireEvent.wheel(container.children[0], { clientY: 10, clientX: 10, buttons: 2, deltaY: -10 });
		await wait();
		assert.isAbove(zoomService.scale, scaleBefore);
	});

	it('should select a layer when clicking', async () => {
		let selectionService: SelectionService = null;
		function TestControl() {
			selectionService = useContext(ControllerContext).selectionService as SelectionService;
			return null;
		}

		const { container } = render(
			<MapFixture>
				<SelectionControl />
				<TestControl />
			</MapFixture>,
		);

		const selectionBefore = selectionService.selected;
		const targetNode = container.children[0].querySelector(
			'[data-tag="0612a23d-5964-4d6d-b17a-118a2d91eace"]',
		).children[0];
		fireEvent.mouseDown(targetNode, {
			clientY: 70,
			clientX: 36,
			buttons: 1,
		});
		await wait();
		assert.notDeepEqual(selectionService.selected, selectionBefore);
	});
});
