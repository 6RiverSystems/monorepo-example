import { detailReducer, detailInitialState } from './detail.reducer';

describe('Detail Reducer', () => {
	describe('unknown action', () => {
		it('should return the initial state', () => {
			const action = {} as any;

			const result = detailReducer(detailInitialState, action);

			expect(result).toBe(detailInitialState);
		});
	});
});
