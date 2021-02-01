import { SelectionService as SelectionServiceBase } from '@sixriver/map-controller';
import { useRef, useReducer } from 'react';

import { reducer as selectionReducer } from './selection.reducer';
import { SelectionService } from '../services/selection-service';

export function useSelectionService<Z extends SelectionServiceBase = SelectionService>(
	SelectionServiceType?: new () => Z,
) {
	const service = useRef(new SelectionServiceType()).current;

	const [state, selectionDispatch] = useReducer(selectionReducer, {
		selection: [],
	});
	if (service instanceof SelectionService) {
		service.state = state;
		service.dispatch = selectionDispatch;
	}
	return {
		service,
		state,
	};
}
