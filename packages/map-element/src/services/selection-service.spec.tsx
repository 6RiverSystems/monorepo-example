import sinon from 'sinon';
import { cloneDeep } from 'lodash-es';
import { assert } from 'chai';

import { SelectionService } from './selection-service';
import { reducer, Actions } from '../controller/selection.reducer';

describe('SelectionService', () => {
	let selectionService: SelectionService;
	let spy: sinon.SinonSpy;
	const state = {
		selection: [
			'0f9f3614-6010-46c6-9788-2ec9b2f97f6e',
			'ce051dfd-6241-41e2-b751-742640e6241c',
			'28c86714-107d-4271-a58c-9d305767cfbb',
			'e4b9edd2-a2df-4011-88c2-cc2940213276',
		],
		primary: '28c86714-107d-4271-a58c-9d305767cfbb',
	};

	beforeEach(() => {
		spy = sinon.spy();
		selectionService = new SelectionService();
		selectionService.state = cloneDeep(state);
		const dispatch = (action: Actions) => {
			selectionService.state = reducer(selectionService.state, action);
			return selectionService.state;
		};
		selectionService.dispatch = dispatch;
		spy = sinon.stub(selectionService, 'dispatch').callsFake((action: Actions) => dispatch(action));
	});

	it('select', () => {
		selectionService.select(['09d3aa89-bcbd-4448-9780-458fa91a62dc']);
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{
				primary: '09d3aa89-bcbd-4448-9780-458fa91a62dc',
				selection: ['09d3aa89-bcbd-4448-9780-458fa91a62dc'],
			},
		]);
	});

	it('select sticky', () => {
		selectionService.select(['09d3aa89-bcbd-4448-9780-458fa91a62dc'], true);
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{
				primary: '0f9f3614-6010-46c6-9788-2ec9b2f97f6e',
				selection: [
					'0f9f3614-6010-46c6-9788-2ec9b2f97f6e',
					'ce051dfd-6241-41e2-b751-742640e6241c',
					'28c86714-107d-4271-a58c-9d305767cfbb',
					'e4b9edd2-a2df-4011-88c2-cc2940213276',
					'09d3aa89-bcbd-4448-9780-458fa91a62dc',
				],
			},
		]);
	});

	it('deselects', () => {
		selectionService.deselect([
			'0f9f3614-6010-46c6-9788-2ec9b2f97f6e',
			'ce051dfd-6241-41e2-b751-742640e6241c',
		]);
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{
				primary: '28c86714-107d-4271-a58c-9d305767cfbb',
				selection: ['28c86714-107d-4271-a58c-9d305767cfbb', 'e4b9edd2-a2df-4011-88c2-cc2940213276'],
			},
		]);
		assert.deepEqual(Array.from(selectionService.selected), [
			'28c86714-107d-4271-a58c-9d305767cfbb',
			'e4b9edd2-a2df-4011-88c2-cc2940213276',
		]);
		assert.equal(selectionService.primary, '28c86714-107d-4271-a58c-9d305767cfbb');
	});

	it('clears selection', () => {
		selectionService.clear();
		sinon.assert.calledOnce(spy);
		assert.deepEqual(spy.returnValues, [
			{
				primary: undefined,
				selection: [],
			},
		]);
		assert.isEmpty(selectionService.selected);
		assert.isUndefined(selectionService.primary);
	});
});
