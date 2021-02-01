import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import {
	SelectionReport,
	SelectionService as SelectionServiceBase,
} from '@sixriver/map-controller';

import { SelectionSelect, SelectionDeselect, SelectionClear } from '../selection/selection.actions';
import { MapCoreState } from '../reducers';
import { SelectionState } from '../selection/selection.reducer';
import { difference } from '../utils';

export { SelectionReport } from '@sixriver/map-controller';

@Injectable()
export class SelectionService implements SelectionServiceBase, OnDestroy {
	private _selected: Set<string>;
	private _subscription: Subscription;
	public selectionChange$: Observable<SelectionReport>;

	constructor(private store: Store<MapCoreState>) {
		this._selected = new Set<string>();

		this.selectionChange$ = this.store.pipe(
			select('selection'),
			pairwise(),
			map(([a, b]) => this._report(a, b)),
		);
		this._subscription = this.selectionChange$.subscribe((state: SelectionReport) => {
			this._selected = state.selected;
		});
	}

	get selected() {
		return new Set(this._selected);
	}

	get primary(): string {
		return this._selected.size ? this._selected.values().next().value : '';
	}

	select(uuid: string | string[], add: boolean = false): void {
		this.store.dispatch(new SelectionSelect({ uuids: toArray(uuid), add }));
	}

	deselect(uuid: string | string[]): void {
		this.store.dispatch(new SelectionDeselect(toArray(uuid)));
	}

	clear(): void {
		this.store.dispatch(new SelectionClear());
	}

	private _report(oldState: SelectionState, newState: SelectionState): SelectionReport {
		return {
			selected: new Set(newState.selection),
			deltaSelected: difference(new Set(newState.selection), new Set(oldState.selection)),
			deltaDeselected: difference(new Set(oldState.selection), new Set(newState.selection)),
			primary: newState.selection.length ? newState.selection[0] : '',
		};
	}

	observe(callback: (report: SelectionReport) => void): Subscription {
		return this.selectionChange$.subscribe(callback);
	}

	ngOnDestroy(): void {
		this._subscription.unsubscribe();
	}
}

function toArray(a) {
	return Array.isArray(a) ? a : [a];
}
