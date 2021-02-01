import { SelectionActions, SelectionActionTypes } from './selection.actions';

export interface SelectionState {
	selection: string[];
}

export const selectionInitialState: SelectionState = {
	selection: [],
};

export function selectionReducer(
	state = selectionInitialState,
	action: SelectionActions,
): SelectionState {
	switch (action.type) {
		case SelectionActionTypes.Select:
			return {
				...state,
				selection: action.payload.add
					? [...state.selection].concat(action.payload.uuids)
					: [...action.payload.uuids],
			};

		case SelectionActionTypes.Deselect:
			return {
				...state,
				selection: _deselect([...state.selection], action.payload),
			};

		case SelectionActionTypes.Clear:
			return {
				...state,
				selection: [],
			};

		default:
			return state;
	}
}

function _deselect(selected, deselected) {
	return selected.filter(e => !deselected.includes(e));
}
