import { Bounds, Point } from '../map/view';

type SetCenterAndScaleAction = {
	type: 'SET_CENTER_AND_SCALE';
	payload: { scale: number; center: Point };
};

type SetScaleAction = {
	type: 'SET_SCALE';
	payload: number;
};

type SetCenterAction = {
	type: 'SET_CENTER';
	payload: Point;
};

type SetBoundsAction = {
	type: 'SET_BOUNDS';
	payload: Bounds;
};

export type Actions = SetScaleAction | SetCenterAction | SetBoundsAction | SetCenterAndScaleAction;

export type State = { scale: number; center: Point; bounds: Bounds };

export const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'SET_BOUNDS':
			return { ...state, bounds: { ...action.payload } };
		case 'SET_SCALE':
			return { ...state, scale: action.payload };
		case 'SET_CENTER':
			return { ...state, center: { ...action.payload } };
		case 'SET_CENTER_AND_SCALE':
			return { ...state, ...action.payload };
	}
};
