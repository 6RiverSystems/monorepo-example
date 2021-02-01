import { assert } from 'chai';
import { uuid } from '@sixriver/map-io';
import { fireEvent } from '@testing-library/dom';

import { SelectionController } from './selection-controller';
import { SelectionService } from '../interfaces/selection-service';
import { DOMPoint, MapPoint } from '../interfaces/point';
import { ControllerStack } from './controller-stack';
import { Bounds } from '../interfaces/bounds';

class MockSelectionService extends SelectionService {
	private _selected: Set<uuid> = new Set();

	get selected(): Set<uuid> {
		return this._selected;
	}

	get primary(): uuid {
		return this._selected.values().next().value;
	}

	select(featureId: uuid | uuid[], appendToSelection: boolean = true): void {
		if (!appendToSelection) {
			this._selected.clear();
		}
		if (Array.isArray(featureId)) {
			featureId.forEach(uuid => {
				this._selected.add(uuid);
			});
		} else {
			this._selected.add(featureId);
		}
	}

	deselect(featureId: uuid | uuid[]): void {
		if (Array.isArray(featureId)) {
			featureId.forEach(uuid => {
				this._selected.delete(uuid);
			});
		} else {
			this._selected.delete(featureId);
		}
	}

	clear(): void {
		this._selected.clear();
	}
}

/**
 * Sends a bunch of dom events to simulate a move.
 */
function simulatedMove(element: HTMLElement) {
	fireEvent.mouseDown(element, { clientY: 10, clientX: 10, buttons: 1, shiftKey: true });
	fireEvent.mouseMove(element, { clientY: 21, clientX: 21, buttons: 1, shiftKey: true });
	fireEvent.mouseMove(element, { clientY: 33, clientX: 33, buttons: 1, shiftKey: true });
	fireEvent.mouseMove(element, { clientY: 46, clientX: 46, buttons: 1, shiftKey: true });
	fireEvent.mouseMove(element, { clientY: 50, clientX: 50, buttons: 1, shiftKey: true });
	fireEvent.mouseUp(element, { clientY: 50, clientX: 50, buttons: 1, shiftKey: true });
}

describe('Selection Controller', () => {
	let controllerStack: ControllerStack;
	let service: SelectionService;
	let currentLayerIdx = 0;
	const layers = [
		{
			id: '865c8b61-a87f-4f06-a295-f6ee2acff1ea',
		},
		{
			id: 'ed3d8a4b-49df-4f50-8f78-5c15bc1b4e03',
		},
	];
	const fixture = document.createElement('div');
	document.body.appendChild(fixture);

	beforeEach(() => {
		currentLayerIdx = 0;

		service = new MockSelectionService();

		controllerStack = new ControllerStack(fixture);
		controllerStack.getLayer = (event: MouseEvent) => {
			return currentLayerIdx < layers.length && currentLayerIdx >= 0
				? layers[currentLayerIdx]
				: undefined;
		};
		controllerStack.translate = (point: DOMPoint) => {
			return new MapPoint(point.x, point.y);
		};
		controllerStack.getIntersectingLayers = (Bounds: Bounds) => {
			return layers;
		};
	});

	afterEach(() => {
		controllerStack.uninstall();
	});

	it('should add and remove the SelectionController', () => {
		const selectionController = new SelectionController(service);
		assert.equal(controllerStack.controllers.length, 0);
		controllerStack.addController(selectionController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 1);

		controllerStack.removeController(selectionController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 0);
	});

	it('should select when click on layer', () => {
		const selectionController = new SelectionController(service);
		controllerStack.addController(selectionController);
		fireEvent.mouseDown(fixture);
		fireEvent.mouseUp(fixture);

		assert.isTrue(service.selected.has(layers[0].id)); // clicking a layer should select it
	});

	it('should not change selection when click on selected layer', () => {
		const selectionController = new SelectionController(service);
		controllerStack.addController(selectionController);
		service.select([layers[0].id, layers[1].id]);
		fireEvent.mouseDown(fixture);
		fireEvent.mouseUp(fixture);

		// at least on layer was deselected
		assert.isTrue(service.selected.has(layers[0].id) && service.selected.has(layers[1].id));
	});

	it('should deselect when click on empty', () => {
		const selectionController = new SelectionController(service);
		controllerStack.addController(selectionController);
		service.select([layers[0].id, layers[1].id]);
		currentLayerIdx = -1;
		fireEvent.mouseDown(fixture);
		fireEvent.mouseUp(fixture);

		assert.equal(service.selected.size, 0);
	});

	it('should not deselect when shift+click on empty', () => {
		const selectionController = new SelectionController(service);
		controllerStack.addController(selectionController);
		service.select([layers[0].id, layers[1].id]);
		currentLayerIdx = -1;
		fireEvent.mouseDown(fixture, { shiftKey: true });
		fireEvent.mouseUp(fixture, { shiftKey: true });

		// a layer has been deselected
		assert.isTrue(service.selected.has(layers[0].id) && service.selected.has(layers[1].id));
	});

	it('should toggle selection when shift+click on layer', () => {
		const selectionController = new SelectionController(service);
		controllerStack.addController(selectionController);
		fireEvent.mouseDown(fixture, { shiftKey: true });
		assert.isTrue(service.selected.has(layers[0].id));
		fireEvent.mouseUp(fixture, { shiftKey: true });
		assert.isTrue(service.selected.has(layers[0].id));

		fireEvent.mouseDown(fixture, { shiftKey: true });
		assert.isTrue(service.selected.has(layers[0].id));
		fireEvent.mouseUp(fixture, { shiftKey: true });
		assert.isFalse(service.selected.has(layers[0].id));
	});

	it('should box select layers', () => {
		const selectionController = new SelectionController(service);
		controllerStack.addController(selectionController);

		simulatedMove(fixture);

		assert.isTrue(service.selected.has(layers[0].id));
	});
});
