import { UsersActions, UsersActionTypes } from './users.actions';
import { User } from '../interfaces/user';

export interface UsersState {
	users: Map<string, User>;
	error: Error;
}

export const usersInitialState: UsersState = {
	users: new Map<string, User>(),
	error: null,
};

export function usersReducer(state = usersInitialState, action: UsersActions): UsersState {
	switch (action.type) {
		case UsersActionTypes.Listen:
			return state;

		case UsersActionTypes.ListenComplete:
			return {
				...state,
				users: new Map([...state.users, [action.payload.badgeBarcode, action.payload]]),
			};

		case UsersActionTypes.ListenError:
			return {
				...state,
				error: action.payload,
			};

		default:
			return state;
	}
}
