import { MapStackActions, MapStackActionTypes, MapStackErrorActions } from './map-stack.actions';
import { MapStack } from '../class/mapstack/MapStack';

export interface MapStackState {
	mapStack: MapStack;
	validation: string[];
	connectivityMatrixValid: boolean;
	saved: boolean;
}

export const mapStackInitialState: MapStackState = {
	mapStack: null,
	validation: [],
	connectivityMatrixValid: false,
	saved: false,
};

export function mapStackReducer(
	state = mapStackInitialState,
	action: MapStackActions | MapStackErrorActions,
): MapStackState {
	switch (action.type) {
		case MapStackActionTypes.Set:
		case MapStackActionTypes.FetchLocalComplete:
		case MapStackActionTypes.FetchComplete: {
			return {
				...state,
				mapStack: action.payload,
			};
		}
		case MapStackActionTypes.SaveComplete: {
			return {
				...state,
				saved: action.type === MapStackActionTypes.SaveComplete,
			};
		}
		case MapStackActionTypes.NotSaved:
			return {
				...state,
				saved: false,
			};
		case MapStackActionTypes.SetConnectivityMatrixValid:
			return {
				...state,
				connectivityMatrixValid: action.payload,
			};
		case MapStackActionTypes.GenerateConnectivityMatrixComplete:
			const newState = {
				...state,
				connectivityMatrixValid: true,
			};
			newState.mapStack.connectivityMatrix = action.payload;
			return newState;

		case MapStackActionTypes.ValidationComplete:
			return { ...state, validation: [] };
		case MapStackActionTypes.ValidationError:
			return { ...state, validation: action.payload.map(e => e.id) };
		default:
			return state;
	}
}
