import sinon from 'sinon';
import { MapPoint } from '@sixriver/map-controller';
import { cloneDeep } from 'lodash-es';
import { assert } from 'chai';

import { ZoomService } from './zoom-service';
import { reducer, Actions } from '../controller/zoom.reducer';

describe('ZoomService', () => {
	let zoomService: ZoomService;
	let spy: sinon.SinonSpy;
	const state = {
		scale: 1,
		center: { x: 0, y: 0 },
		bounds: { x1: -100, y1: -100, x2: 100, y2: 100 },
	} as const;

	beforeEach(() => {
		spy = sinon.fake();
		zoomService = new ZoomService();
		zoomService.state = cloneDeep(state);
		const dispatch = (action: Actions) => {
			zoomService.state = reducer(zoomService.state, action);
			return zoomService.state;
		};

		zoomService.dispatch = dispatch;
		spy = sinon.stub(zoomService, 'dispatch').callsFake((action: Actions) => dispatch(action));
	});

	it('set translate', () => {
		zoomService.setTranslate({ x: 100, y: 250 });
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 100, y: 250 }, scale: 1 },
		]);
	});

	it('set scale', () => {
		zoomService.setScale(20);
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 10 },
		]);
	});

	it('set scale and center', () => {
		zoomService.scaleAndTranslate(10, { x: 100, y: 250 });
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 100, y: 250 }, scale: 10 },
		]);
	});

	it('set scale around point', () => {
		zoomService.scaleAroundPoint(2, new MapPoint(50, 50));
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: -25, y: -25 }, scale: 2 },
		]);
	});

	it('zooms in discrete steps', () => {
		zoomService.zoomInDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 1.25 },
		]);
		spy.resetHistory();
		zoomService.state = { ...state, scale: 9.5 };
		zoomService.zoomInDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 10 },
		]);
		spy.resetHistory();
		zoomService.state = { ...state, scale: 0.5 };
		zoomService.zoomInDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 0.666 },
		]);
		spy.resetHistory();
		zoomService.state = { ...state, scale: 10 };
		zoomService.zoomInDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 10 },
		]);
	});

	it('zooms out discrete steps', () => {
		zoomService.zoomOutDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 0.75 },
		]);
		spy.resetHistory();
		zoomService.state = { ...state, scale: 9.5 };
		zoomService.zoomOutDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 8 },
		]);
		spy.resetHistory();
		zoomService.state = { ...state, scale: 0.5 };
		zoomService.zoomOutDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 0.333 },
		]);
		spy.resetHistory();
		zoomService.state = { ...state, scale: 0.1 };
		zoomService.zoomOutDiscrete();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 0.1 },
		]);
	});

	it('resets zoom', () => {
		zoomService.state = { ...state, center: { x: 987, y: -76 }, scale: 9.5 };
		zoomService.resetZoom();
		assert.deepEqual(spy.returnValues, [
			{ bounds: state.bounds, center: { x: 0, y: 0 }, scale: 1 },
		]);
	});
});
