import { SelectionService as SelectionServiceAbstract } from '@sixriver/map-controller';
import { Dispatch } from 'react';

import { State, Actions } from '../controller/selection.reducer';

export class SelectionService implements SelectionServiceAbstract {
	constructor() {}
	public state: State;
	public dispatch: Dispatch<Actions>;

	get selected() {
		return new Set(this.state.selection);
	}

	get primary(): string | undefined {
		return this.state.primary;
	}

	select(uuid: string | string[], append: boolean = false): void {
		const selection = toArray(uuid);
		this.dispatch({ type: 'SELECT', payload: { selection, sticky: append } });
	}

	deselect(uuid: string | string[]): void {
		const deselection = toArray(uuid);
		this.dispatch({ type: 'DESELECT', payload: deselection });
	}

	clear(): void {
		this.dispatch({ type: 'CLEAR_SELECTION' });
	}
}

function toArray(a) {
	return Array.isArray(a) ? a : [a];
}
