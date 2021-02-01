import { assert } from 'chai';
import { spy } from 'sinon';
import { fireEvent } from '@testing-library/dom';

import { Controller } from './controller';
import { ControllerStack } from './controller-stack';

describe('ControllerStack', () => {
	let controllerStack: ControllerStack;
	const fixture = document.createElement('div');
	document.body.appendChild(fixture);

	class TestController extends Controller {
		constructor() {
			super();
		}

		name() {
			return 'testController';
		}
	}

	beforeEach(() => {
		controllerStack = new ControllerStack(fixture);
	});

	afterEach(() => {
		controllerStack.uninstall();
	});

	it('should add and remove controllers', () => {
		const controller = new TestController();
		assert.equal(controllerStack.controllers.length, 0);
		controllerStack.addController(controller);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 1);

		controllerStack.removeController(controller);
		assert.isUndefined(controllerStack.activeController);
		assert.equal(controllerStack.controllers.length, 0);
	});

	it('should activate and deactivate controllers', () => {
		const controller = new TestController();
		assert.isUndefined(controllerStack.activeController);
		controllerStack.addController(controller);
		controller.activate();
		assert.strictEqual(controllerStack.activeController, controller);
		controller.deactivate();
		assert.isUndefined(controllerStack.activeController);
		controller.activate();
		controllerStack.removeController(controller);
		assert.isUndefined(controllerStack.activeController);
	});

	it('should pass events to the controllers', async () => {
		const handleEventSpy = spy(controllerStack, 'handleEvent');

		fireEvent.mouseDown(fixture);
		fireEvent.mouseMove(fixture);
		assert.equal(handleEventSpy.callCount, 2);

		const controller1 = new TestController();
		const handleMouseDownSpy1 = spy(controller1, 'handleMouseDown');
		const controller2 = new TestController();
		const handleMouseDownSpy2 = spy(controller2, 'handleMouseDown');
		controllerStack.addController(controller1);
		controllerStack.addController(controller2);

		fireEvent.mouseDown(fixture);
		assert.equal(handleMouseDownSpy1.calledOnce, true);
		assert.equal(handleMouseDownSpy2.calledOnce, true);
	});

	it('should only pass events to the active controller', () => {
		const controller1 = new TestController();
		const handleMouseDownSpy1 = spy(controller1, 'handleMouseDown');
		const controller2 = new TestController();
		const handleMouseDownSpy2 = spy(controller2, 'handleMouseDown');
		controllerStack.addController(controller1);
		controllerStack.addController(controller2);

		controller1.activate();

		// The event should only go to controller1 because it is active
		fireEvent.mouseDown(fixture);
		assert.equal(handleMouseDownSpy1.calledOnce, true);
		assert.equal(handleMouseDownSpy2.notCalled, true);

		controller2.activate();

		// The event should only go to controller2 because it is active
		fireEvent.mouseDown(fixture);
		assert.equal(handleMouseDownSpy1.calledOnce, true);
		assert.equal(handleMouseDownSpy2.calledOnce, true);

		controller2.deactivate();

		// The event should go to both controllers
		fireEvent.mouseDown(fixture);
		assert.equal(handleMouseDownSpy1.calledTwice, true);
		assert.equal(handleMouseDownSpy2.calledTwice, true);
	});

	it('should consume the event if a controller handles the event', () => {
		const controller1 = new TestController();
		controller1.handleMouseDown = () => true;
		const handleMouseDownSpy1 = spy(controller1, 'handleMouseDown');
		const controller2 = new TestController();
		const handleMouseDownSpy2 = spy(controller2, 'handleMouseDown');
		controllerStack.addController(controller1);
		controllerStack.addController(controller2);

		fireEvent.mouseDown(fixture);
		assert.equal(handleMouseDownSpy1.calledOnce, true);
		assert.equal(handleMouseDownSpy2.notCalled, true);
	});
});
