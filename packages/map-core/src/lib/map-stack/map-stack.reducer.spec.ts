import { mapStackReducer, mapStackInitialState } from './map-stack.reducer';

describe('MapStack Reducer', () => {
	describe('unknown action', () => {
		it('should return the initial state', () => {
			const action = {} as any;

			const result = mapStackReducer(mapStackInitialState, action);

			expect(result).toBe(mapStackInitialState);
		});
	});
});
