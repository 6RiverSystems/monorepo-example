import { ZoomService as ZoomServiceBase } from '@sixriver/map-controller';
import { useRef, useReducer } from 'react';
import { isEqual } from 'lodash-es';

import { ViewState } from '../map/view';
import { ZoomService } from '../services/zoom-service';
import { reducer as zoomReducer } from './zoom.reducer';

/**
 * Creates a ZoomService which acts as an api for changing and getting the zoom state.
 */
export function useZoomService<Z extends ZoomServiceBase = ZoomService>(
	ZoomServiceType?: new () => Z,
	viewState?: ViewState,
) {
	const service = useRef(new ZoomServiceType()).current;
	const [state, zoomDispatch] = useReducer(zoomReducer, {
		scale: viewState.scale,
		center: viewState.translate,
		bounds: viewState.bounds,
	});
	if (service instanceof ZoomService) {
		service.state = state;
		service.dispatch = zoomDispatch;
	}
	if (!isEqual(viewState.bounds, state.bounds)) {
		zoomDispatch({ type: 'SET_BOUNDS', payload: viewState.bounds });
	}

	return {
		service,
		state,
	};
}
