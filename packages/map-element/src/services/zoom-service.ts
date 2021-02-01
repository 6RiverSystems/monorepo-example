import {
	ZoomService as ZoomServiceAbstract,
	Bounds,
	Point,
	MapPoint,
} from '@sixriver/map-controller';
import { Dispatch } from 'react';

import { ViewState, transformAroundPointWithScale } from '../map/view';
import { Actions, State } from '../controller/zoom.reducer';

const maxScale = 10;
const minScale = 0.1;
/* prettier-ignore */
const zoomSteps =
	[minScale, 0.2, 0.333, 0.5, 0.666, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3.333, 4, 5, 6.666, 8, maxScale] as const;

const findStep = (scale: State['scale']) => {
	return zoomSteps.indexOf(zoomSteps.find(step => step >= scale) || maxScale);
};

export class ZoomService extends ZoomServiceAbstract {
	public state: State;
	public dispatch: Dispatch<Actions>;

	get bounds(): Bounds {
		return new Bounds(
			new MapPoint(this.state.bounds.x1, this.state.bounds.y1),
			new MapPoint(this.state.bounds.x2, this.state.bounds.y2),
		);
	}

	get scale(): number {
		return this.state.scale || 1;
	}

	get translate(): Point {
		return this.state.center || { x: 0, y: 0 };
	}

	get viewState(): ViewState {
		return {
			scale: this.scale,
			translate: this.translate,
			bounds: {
				x1: this.bounds.min.x,
				y1: this.bounds.min.y,
				x2: this.bounds.max.x,
				y2: this.bounds.max.y,
			},
		};
	}

	private clampZoom(scale: number): number {
		return Math.max(minScale, Math.min(maxScale, scale));
	}

	setTranslate(translate: Point) {
		this.dispatch({ type: 'SET_CENTER', payload: translate });
	}

	setScale(scale: number) {
		scale = this.clampZoom(scale);
		this.dispatch({ type: 'SET_SCALE', payload: scale });
	}

	scaleAndTranslate(scale: number, translate: Point) {
		scale = this.clampZoom(scale);
		this.dispatch({ type: 'SET_CENTER_AND_SCALE', payload: { scale, center: translate } });
	}

	scaleAroundPoint(scale: number, point: MapPoint) {
		scale = this.clampZoom(scale);
		const { scale: newScale, translate } = transformAroundPointWithScale(
			point,
			scale,
			this.viewState,
		);
		this.dispatch({
			type: 'SET_CENTER_AND_SCALE',
			payload: { scale: newScale, center: translate },
		});
	}

	zoomInDiscrete(): void {
		const scaleIndex = findStep(this.state.scale);
		if (scaleIndex >= 0) {
			this.scaleAndTranslate(
				zoomSteps[Math.min(zoomSteps.length - 1, scaleIndex + 1)],
				this.state.center,
			);
		}
	}

	zoomOutDiscrete(): void {
		const scaleIndex = findStep(this.state.scale);
		if (scaleIndex >= 0) {
			this.scaleAndTranslate(zoomSteps[Math.max(0, scaleIndex - 1)], this.state.center);
		}
	}

	resetZoom(): void {
		this.scaleAndTranslate(1, { x: 0, y: 0 });
	}
}
