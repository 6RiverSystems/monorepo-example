import { mfpsReducer, mfpsInitialState } from './mfps.reducer';

describe('Mfps Reducer', () => {
	describe('unknown action', () => {
		it('should return the initial state', () => {
			const action = {} as any;

			const result = mfpsReducer(mfpsInitialState, action);

			expect(result).toBe(mfpsInitialState);
		});
	});
});
