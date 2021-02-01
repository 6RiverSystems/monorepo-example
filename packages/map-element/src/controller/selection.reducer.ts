type SelectAction = {
	type: 'SELECT';
	payload: { selection: string[]; sticky: boolean };
};

type DeselectAction = {
	type: 'DESELECT';
	payload: string[];
};

type ClearSelectionAction = {
	type: 'CLEAR_SELECTION';
};

export type Actions = SelectAction | DeselectAction | ClearSelectionAction;

export type State = { selection: string[]; primary?: string };

export const reducer = (state: State, action: Actions): State => {
	let newState: State;
	switch (action.type) {
		case 'SELECT':
			newState = {
				...state,
				selection: action.payload.sticky
					? state.selection.concat(action.payload.selection)
					: action.payload.selection,
			};
			newState.primary = newState.selection.length ? newState.selection[0] : undefined;
			return newState;
		case 'DESELECT':
			newState = {
				...state,
				selection: state.selection.filter(id => !action.payload.includes(id)),
			};
			newState.primary = newState.selection.length ? newState.selection[0] : undefined;
			return newState;
		case 'CLEAR_SELECTION':
			return { ...state, selection: [], primary: undefined };
	}
};
