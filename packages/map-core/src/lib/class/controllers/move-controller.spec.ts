import { TestBed, inject } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { LatLng, LatLngBounds, map, Map } from 'leaflet';
import { ControllerStack } from '@sixriver/map-controller';
import { fireEvent } from '@testing-library/dom';

import { TestModule } from '../../test.module';
import { MoveController } from './move-controller';
import { SelectionService } from '../../services/selection.service';
import { Aisle } from '../mapstack/Aisle';
import { WorkflowPoint } from '../mapstack/WorkflowPoint';
import { ImpassableArea } from '../mapstack/ImpassableArea';
import { Pose } from '../../interfaces/pose';
import { attachToLeaflet } from '../../directives/attach-to-leaflet';
import { editorOptions } from '../../interfaces/map-display-options';
describe('Move Controller', () => {
	let fixture: HTMLElement;
	let controllerStack: ControllerStack;
	let moveController: MoveController;
	let selectionService: SelectionService;
	let testMap: Map;
	let workflowPoint: WorkflowPoint;
	let aisle: Aisle;
	let area: ImpassableArea;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [SelectionService],
		});

		fixture = document.createElement('div');
		fixture.style.width = '100px';
		fixture.style.height = '100px';
		document.body.appendChild(fixture);
		testMap = map(fixture, {});

		// add some default types, a polygon, a polyline and a marker.
		aisle = new Aisle([new LatLng(-10, -10), new LatLng(10, 10)], {}, '', 'aisle-1');
		testMap.addLayer(aisle);

		workflowPoint = new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, 'workflow-point-1');
		testMap.addLayer(workflowPoint);

		area = new ImpassableArea(
			new LatLngBounds(new LatLng(-10, -10), new LatLng(10, 10)),
			{},
			'',
			'area-1',
		);
		testMap.addLayer(area);

		testMap.invalidateSize();
		testMap.setView([0, 0], 1);

		controllerStack = new ControllerStack(fixture);
		attachToLeaflet(controllerStack, testMap, editorOptions, TestBed.get(NgZone));
	});

	beforeEach(inject([SelectionService], (service: SelectionService) => {
		selectionService = service;
		moveController = new MoveController(service, testMap);
		controllerStack.addController(moveController);
	}));

	afterEach(() => {
		testMap.off();
		testMap.remove();
		controllerStack.uninstall();
		document.body.removeChild(fixture);
	});

	/**
	 * Sends a bunch of dom events to simulate a move.
	 */
	function simulatedMove(element: HTMLElement) {
		fireEvent.mouseDown(element, { clientY: 10, clientX: 10, buttons: 1 });
		fireEvent.mouseMove(element, { clientY: 21, clientX: 21, buttons: 1 });
		fireEvent.mouseMove(element, { clientY: 33, clientX: 33, buttons: 1 });
		fireEvent.mouseMove(element, { clientY: 46, clientX: 46, buttons: 1 });
		fireEvent.mouseMove(element, { clientY: 50, clientX: 50, buttons: 1 });
		fireEvent.mouseUp(element, { clientY: 50, clientX: 50, buttons: 1 });
	}

	it('should add and remove the moveController', () => {
		expect(controllerStack.activeController).toBeUndefined();
		expect(controllerStack.controllers.length).toEqual(1);

		controllerStack.removeController(moveController);
		expect(controllerStack.activeController).toBeUndefined();
		expect(controllerStack.controllers.length).toEqual(0);

		controllerStack.addController(moveController);
		expect(controllerStack.controllers.length).toEqual(1);
	});

	it('should move a workflow point', () => {
		selectionService.select('workflow-point-1');

		const poseBefore = Object.assign({}, workflowPoint.pose);
		simulatedMove(workflowPoint.getElement());

		expect(workflowPoint.pose.x).toBeGreaterThan(poseBefore.x);
		expect(workflowPoint.pose.y).toBeLessThan(poseBefore.y);
		expect(workflowPoint.pose.orientation).toEqual(poseBefore.orientation);
	});

	it('should move an aisle', () => {
		selectionService.select('aisle-1');

		const lat = aisle.getCenter().lat;
		const lng = aisle.getCenter().lng;

		simulatedMove(<HTMLElement>aisle.getElement());

		expect(aisle.getCenter().lat).toBeLessThan(lat);
		expect(aisle.getCenter().lng).toBeGreaterThan(lng);
	});

	it('should move an area', () => {
		selectionService.select('area-1');

		const lat = area.getCenter().lat;
		const lng = area.getCenter().lng;

		simulatedMove(<HTMLElement>area.getElement());

		expect(area.getCenter().lat).toBeLessThan(lat);
		expect(area.getCenter().lng).toBeGreaterThan(lng);
	});
});
