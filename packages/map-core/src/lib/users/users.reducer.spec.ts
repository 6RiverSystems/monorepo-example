import { usersReducer, usersInitialState } from './users.reducer';

describe('Users Reducer', () => {
	describe('unknown action', () => {
		it('should return the initial state', () => {
			const action = {} as any;

			const result = usersReducer(usersInitialState, action);

			expect(result).toBe(usersInitialState);
		});
	});
});
