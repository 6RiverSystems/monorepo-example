import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { mfpsReducer, MfpState } from '../mfps/mfps.reducer';
import { usersReducer, UsersState } from '../users/users.reducer';
import { selectionReducer, SelectionState } from '../selection/selection.reducer';
import { mapStackReducer, MapStackState } from '../map-stack/map-stack.reducer';
import { detailReducer, DetailState } from '../detail/detail.reducer';
import { displayOptionsReducer, DisplayOptionsState } from '../display-options/display-options.reducer';

export interface MapCoreState {
	mfps: MfpState;
	users: UsersState;
	selection: SelectionState;
	mapStack: MapStackState;
	detail: DetailState;
	displayOptions: DisplayOptionsState;
}

export const mapCoreReducers: ActionReducerMap<MapCoreState> = {
	mfps: mfpsReducer,
	users: usersReducer,
	selection: selectionReducer,
	mapStack: mapStackReducer,
	detail: detailReducer,
	displayOptions: displayOptionsReducer
};

export const mapCoreMetaReducers: MetaReducer<MapCoreState>[] = [];
