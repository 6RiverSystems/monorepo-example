import { Layer } from '../interfaces/layer';
import { DetailActions, DetailActionTypes } from './detail.actions';

export interface DetailState {
	isOpen: boolean;
	layers: Layer[];
}

export const detailInitialState: DetailState = {
	isOpen: false,
	layers: [],
};

export function detailReducer(state = detailInitialState, action: DetailActions): DetailState {
	switch (action.type) {
		case DetailActionTypes.Open:
			return {
				...state,
				isOpen: true,
				layers: action.payload,
			};
		case DetailActionTypes.Update:
			return {
				...state,
				layers: action.payload,
			};
		case DetailActionTypes.Close:
			return {
				...state,
				isOpen: false,
				layers: [],
			};
		default:
			return state;
	}
}
