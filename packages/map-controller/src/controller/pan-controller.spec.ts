import { assert } from 'chai';
import { fireEvent } from '@testing-library/dom';

import { PanController } from './pan-controller';
import { ZoomService } from '../interfaces/zoom-service';
import { DOMPoint, MapPoint, Point } from '../interfaces/point';
import { Bounds } from '../interfaces/bounds';
import { ControllerStack } from './controller-stack';

export class MockZoomService extends ZoomService {
	bounds: Bounds;
	scale: number = 1;
	translate: Point = { x: 0, y: 0 };
	setTranslate(translate: Point) {
		this.translate = translate;
	}

	setScale(scale: number) {
		this.scale = scale;
	}

	scaleAndTranslate(scale: number, translate: Point) {
		this.translate = translate;
		this.scale = scale;
	}

	scaleAroundPoint(scale: number, point: Point) {
		this.translate = point;
		this.scale = scale;
	}

	zoomInDiscrete(): void {
		this.scale += 1;
	}

	zoomOutDiscrete(): void {
		this.scale -= 1;
	}

	resetZoom(): void {
		this.scale = 1;
		this.translate = { x: 0, y: 0 };
	}
}

describe('Pan Controller', () => {
	let controllerStack: ControllerStack;
	let service: ZoomService;

	const fixture = document.createElement('div');
	document.body.appendChild(fixture);

	beforeEach(() => {
		service = new MockZoomService();

		controllerStack = new ControllerStack(fixture);
		controllerStack.getLayer = () => {};
		controllerStack.translate = (point: DOMPoint) => {
			return new MapPoint(point.x, point.y);
		};
	});

	afterEach(() => {
		controllerStack.uninstall();
	});

	it('should add and remove the PanController', () => {
		const panController = new PanController(service);
		assert.equal(controllerStack.controllers.length, 0);
		controllerStack.addController(panController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 1);

		controllerStack.removeController(panController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 0);
	});

	it('pan the scene by delta', () => {
		const panController = new PanController(service);
		const originalCenter = { ...service.translate };
		controllerStack.addController(panController);

		fireEvent.mouseDown(fixture, { clientY: 10, clientX: 10, buttons: 1 });
		assert.deepEqual(originalCenter, service.translate);
		fireEvent.mouseMove(fixture, { clientY: 15, clientX: 15, buttons: 1 });
		fireEvent.mouseMove(fixture, { clientY: 5, clientX: 5, buttons: 1 });
		assert.deepEqual(originalCenter, service.translate);
		fireEvent.mouseMove(fixture, { clientY: 15, clientX: 15, buttons: 1 });
		fireEvent.mouseMove(fixture, { clientY: 20, clientX: 20, buttons: 1 });
		fireEvent.mouseMove(fixture, { clientY: 25, clientX: 35, buttons: 1 });
		assert.deepEqual(service.translate, { x: 25, y: 15 });
		fireEvent.mouseUp(fixture);
	});
});
