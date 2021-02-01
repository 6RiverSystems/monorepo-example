import { assert } from 'chai';
import { fireEvent } from '@testing-library/dom';

import { ZoomController } from './zoom-controller';
import { ZoomService } from '../interfaces/zoom-service';
import { DOMPoint, MapPoint } from '../interfaces/point';
import { ControllerStack } from './controller-stack';
import { MockZoomService } from './pan-controller.spec';

describe('Zoom Controller', () => {
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

	it('should add and remove the ZoomController', () => {
		const zoomController = new ZoomController(service);
		assert.equal(controllerStack.controllers.length, 0);
		controllerStack.addController(zoomController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 1);

		controllerStack.removeController(zoomController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 0);
	});

	it('pan the scene by delta', () => {
		const zoomController = new ZoomController(service);
		const originalCenter = { ...service.translate };
		const originalScale = service.scale;
		controllerStack.addController(zoomController);

		fireEvent.wheel(fixture, { clientY: 10, clientX: 10, buttons: 2, deltaY: 10 });
		assert.notDeepEqual(originalCenter, service.translate);
		assert.deepEqual(service.translate, { x: 10, y: 10 });
		assert.notEqual(originalScale, service.scale);
		assert.equal(service.scale, 0.95);
		fireEvent.wheel(fixture, { clientY: 10, clientX: 10, buttons: 2, deltaY: 100 });
		assert.equal(service.scale, 0.475);
		service.scaleAndTranslate(1, { x: 0, y: 0 });
		fireEvent.wheel(fixture, { clientY: 10, clientX: 10, buttons: 2, deltaY: -100 });
		assert.equal(service.scale, 1.5);
	});
});
