import { assert } from 'chai';
import { fireEvent } from '@testing-library/dom';

import { PositionController } from './position-controller';
import { DOMPoint, MapPoint } from '../interfaces/point';
import { ControllerStack } from './controller-stack';

describe('Position Controller', () => {
	let controllerStack: ControllerStack;

	const fixture = document.createElement('div');
	document.body.appendChild(fixture);

	beforeEach(() => {
		controllerStack = new ControllerStack(fixture);
		controllerStack.getLayer = () => {};
		controllerStack.translate = (point: DOMPoint) => {
			return new MapPoint(point.x * 2, point.y * 2);
		};
	});

	afterEach(() => {
		controllerStack.uninstall();
	});

	it('should add and remove the PositionController', () => {
		const positionController = new PositionController();
		assert.equal(controllerStack.controllers.length, 0);
		controllerStack.addController(positionController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 1);

		controllerStack.removeController(positionController);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 0);
	});

	it('updates the position indicator', async () => {
		const positionController = new PositionController();
		controllerStack.addController(positionController);
		assert.isNotNull(fixture.querySelector('.position-box'));
		fireEvent.mouseMove(fixture, { clientY: 21, clientX: 21 });
		assert.equal(fixture.querySelector('.position-box').innerHTML, '42.000,42.000');
		fireEvent.mouseMove(fixture, { clientY: 22, clientX: 22 });
		assert.equal(fixture.querySelector('.position-box').innerHTML, '44.000,44.000');
		console.log(fixture.querySelector('.position-box'));
	});
});
