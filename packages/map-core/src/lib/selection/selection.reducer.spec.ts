import { selectionReducer, selectionInitialState } from './selection.reducer';

describe('Selection Reducer', () => {
	describe('unknown action', () => {
		it('should return the initial state', () => {
			const action = {} as any;

			const result = selectionReducer(selectionInitialState, action);

			expect(result).toBe(selectionInitialState);
		});
	});
});
