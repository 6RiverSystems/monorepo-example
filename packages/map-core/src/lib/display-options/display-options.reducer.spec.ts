
import {
	displayOptionsReducer as reducer,
	DisplayOptionsInitialState as initialState,
	getOption,
} from './display-options.reducer';
import {
	SetDisplayOptions,
	SetDisplayOption
} from './display-options.actions';
import { liveViewOptions, DisplayOptions, DisplayOptionsObject } from '../interfaces/map-display-options';
import { mapToObj } from '../utils';

describe('Display Options Reducer', () => {
	const state = { options: mapToObj(liveViewOptions) as DisplayOptionsObject }
	
	describe('unknown action', () => {
		it('should return the initial state', () => {
			const action = {} as any;

			const result = reducer(initialState, action);
			expect(result).toBe(initialState);
		});
	});

	describe('getOption selector', () => {
		beforeEach(() => {
			getOption.release();
			reducer(state, new SetDisplayOption(DisplayOptions.MaxZoom, 7));
		});

		it('should get individual option', () => {
			expect(getOption.projector(state, DisplayOptions.MaxZoom )).toBe(7);
		});
	});

	describe('actions', () => {
		beforeEach(() => {
			getOption.release();
			reducer(state, new SetDisplayOptions(liveViewOptions));
		});

		it('should set display options en masse', () => {
			const result = reducer(state, new SetDisplayOptions(liveViewOptions));
			expect(result.options).toEqual(mapToObj(liveViewOptions));
		});
	
		it('should set display options individually', () => {
			expect(getOption.projector(state, DisplayOptions.MaxZoom)).toBe(7);
			const result = reducer(state, new SetDisplayOption(DisplayOptions.MaxZoom, 5));
			expect(result.options[DisplayOptions.MaxZoom]).toEqual(5)
		});
	})
});
