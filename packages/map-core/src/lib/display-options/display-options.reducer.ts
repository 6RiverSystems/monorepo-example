import { createSelector, createFeatureSelector } from '@ngrx/store';

import { DisplayOptionsActions, DisplayOptionsActionTypes } from './display-options.actions';
import { DisplayOptionsObject, DisplayOptions } from '../interfaces/map-display-options';
import { mapToObj } from '../utils';

export interface DisplayOptionsState {
	options: DisplayOptionsObject|null;
}

export const DisplayOptionsInitialState: DisplayOptionsState = {
	options: null
};
const selectDisplayOptions = createFeatureSelector('displayOptions');

export const getOption = createSelector(
	selectDisplayOptions,
	(state: DisplayOptionsState, props: DisplayOptions) => {
		if (state.options) {
			return state.options[props]
		}
	}
);

export const isWorkflowPointConfiguratorEnabled = createSelector(
	selectDisplayOptions,
	(state: DisplayOptionsState): boolean => {
		if (state.options) {
			return state.options[DisplayOptions.WorkflowStatusToggleEnabled] === true
				|| state.options[DisplayOptions.QueueDepthToggleEnabled] === true;
		}
		return false;
	}
);

export const canSelect = createSelector(
	selectDisplayOptions,
	(state: DisplayOptionsState, option: DisplayOptions | string): boolean => {
		if (state.options && state.options[option]) {
			return state.options[option].selectable;
		}
		return false;
	}
);

export const canInspect = createSelector(
	selectDisplayOptions,
	(state: DisplayOptionsState, option: DisplayOptions | string): boolean => {
		if (state.options && state.options[option]) {
			return state.options[option].inspectable;
		}
		return false;
	}
);

export const canMove = createSelector(
	selectDisplayOptions,
	(state: DisplayOptionsState, option: DisplayOptions | string): boolean => {
		if (state.options && state.options[option]) {
			return state.options[option].movable;
		}
		return false;
	}
);

export const canEdit = createSelector(
	selectDisplayOptions,
	(state: DisplayOptionsState, option: DisplayOptions | string): boolean => {
		if (state.options && state.options[option]) {
			return state.options[option].editable;
		}
		return false;
	}
);

export function displayOptionsReducer(
	state = DisplayOptionsInitialState,
	action: DisplayOptionsActions,
): DisplayOptionsState {
	switch (action.type) {
		
		case DisplayOptionsActionTypes.SetDisplayOptions: {
			let options;
			if (!action.options) {
				options = {}
			} else {
				options = mapToObj(action.options) as DisplayOptionsObject;
			}
			return {
				...state,
				options,
			};
		}
		case DisplayOptionsActionTypes.SetDisplayOption: {
			return {
				...state,
				options: {
					...(state.options || {} as DisplayOptionsObject),
					[action.key]: action.value,
				},
			};
		}
		default:
			return state;
	}
}
