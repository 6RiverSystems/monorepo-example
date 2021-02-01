import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { TestModule } from '../test.module';
import { DisplayOptionsService } from './display-options.service';
import { powerUserOptions, liveViewOptions, editorOptions, DisplayOptions } from '../interfaces/map-display-options';
import { DisplayOptionsState, getOption } from '../display-options/display-options.reducer';
import { SetDisplayOptions, SetDisplayOption } from '../display-options/display-options.actions';
import { createExpectedObservable } from '../test/effect-testing';
import { mapToObj, objToMap } from '../utils';

describe('DisplayOptionsService', () => {
	let mockStore: MockStore<DisplayOptionsState>;
	let service: DisplayOptionsService;

	const initialState = {
		displayOptions: {
			options: mapToObj(liveViewOptions)
		}
	};

	beforeEach(() => {
		// selectors are memoized and can leak state between tests
		getOption.release();
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [
				DisplayOptionsService,
				provideMockStore({ initialState }),
			],
		});
		service = TestBed.get(DisplayOptionsService);
		mockStore = TestBed.get(Store);
		spyOn(mockStore, 'dispatch').and.callThrough();
		spyOn(mockStore, 'select').and.callThrough();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('setOptions', () => {
		it('should get the set and return the options', () => {
			const result = service.setOptions(powerUserOptions);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new SetDisplayOptions(powerUserOptions));
		});
	});

	describe('selectPreset', () => {
		it('should get the set and return the liveViewOptions', () => {
			const result = service.selectPreset('liveViewOptions')
			expect(result).toEqual(liveViewOptions);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new SetDisplayOptions(liveViewOptions));
		});
		
		it('should get the set and return the powerUserOptions', () => {
			const result = service.selectPreset('powerUserOptions')
			expect(result).toEqual(powerUserOptions);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new SetDisplayOptions(powerUserOptions));
		});

		it('should get the set and return the editorOptions', () => {
			const result = service.selectPreset('editorOptions')
			expect(result).toEqual(editorOptions);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new SetDisplayOptions(editorOptions));
		});
	});

	describe('setOption', () => {
		it('should get the set WorkflowStatusToggleEnabled option in the mockStore', () => {
			const option = DisplayOptions.WorkflowStatusToggleEnabled;
			service.setOption(DisplayOptions.WorkflowStatusToggleEnabled, true);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new SetDisplayOption(option, true));
		});
	});

	describe('getOptions$', () => {
		it('should return an observable of the display options', () => {
			const result = service.getOptions$();
			expect(result).toBeObservable(createExpectedObservable([objToMap(initialState.displayOptions.options)]))
		});
	});

	describe('getOption$', () => {
		it('should return an observable of an individual display option', () => {
			const result = service.getOption$(DisplayOptions.MaxZoom);
			expect(result).toBeObservable(createExpectedObservable([7]));
		});
	});
});
