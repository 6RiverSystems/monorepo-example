import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, MemoizedSelectorWithProps } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import {
	DisplayOptionsMap,
	liveViewOptions,
	editorOptions,
	powerUserOptions,
	DisplayOptions,
	DisplayOptionValue,
} from '../interfaces/map-display-options';
import {
	getOption,
	isWorkflowPointConfiguratorEnabled,
	canMove,
	canInspect,
	canEdit,
	canSelect,
} from '../display-options/display-options.reducer';
import { SetDisplayOptions, SetDisplayOption } from '../display-options/display-options.actions';
import { MapCoreState } from '../reducers';
import { objToMap } from '../utils';

type DisplayOptionPresets = 'editorOptions' | 'liveViewOptions' | 'powerUserOptions';

@Injectable()
export class DisplayOptionsService {
	private options$: Observable<DisplayOptionsMap>;

	constructor(private store: Store<MapCoreState>) {}

	public setOptions(options: DisplayOptionsMap): DisplayOptionsMap {
		this.store.dispatch(new SetDisplayOptions(options));
		return options;
	}

	public selectPreset(preset: DisplayOptionPresets): DisplayOptionsMap {
		const presets = {
			editorOptions,
			liveViewOptions,
			powerUserOptions,
		};
		return this.setOptions(presets[preset]);
	}

	public setOption(key: DisplayOptions, value: DisplayOptionValue) {
		this.store.dispatch(new SetDisplayOption(key, value));
	}

	public getOptions$(): Observable<DisplayOptionsMap> {
		return this.store.select('displayOptions', 'options').pipe(
			map(options => {
				if (options) {
					return objToMap(options) as DisplayOptionsMap;
				} else {
					return new Map();
				}
			}),
		);
	}

	public getOption$(option: DisplayOptions | string): Observable<DisplayOptionValue | undefined> {
		return this.store.select(getOption, option);
	}

	public isWorkflowPointConfiguratorEnabled$(): Observable<boolean> {
		return this.store.select(isWorkflowPointConfiguratorEnabled);
	}

	public canEdit(layerType): boolean {
		return this.getState(canEdit, layerType);
	}

	public canSelect(layerType): boolean {
		return this.getState(canSelect, layerType);
	}

	public canMove(layerType): boolean {
		return this.getState(canMove, layerType);
	}

	public canInspect(layerType): boolean {
		return this.getState(canInspect, layerType);
	}

	public get(option: DisplayOptions) {
		return this.getState(getOption, option);
	}

	private getState(selector: MemoizedSelectorWithProps<unknown, unknown, unknown>, ...args) {
		let result;
		this.store
			.select(selector, args)
			.pipe(take(1))
			.subscribe(value => {
				result = value;
			});
		return result;
	}
}
