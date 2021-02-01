import { isEqual, pick } from 'lodash-es';
import { NgZone, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { FeatureGroup } from 'leaflet';
import { distinctUntilChanged } from 'rxjs/operators';

import { Mfp } from '../interfaces/mfp';
import { MfpDisplay } from '../class/mapstack/MfpDisplay';
import { MapEvents, MfpDragEndEvent } from '../interfaces/events';
import { Pose } from '../interfaces/pose';
import { Filter } from './mfps.reducer';

export const MFP_DEFAULT_OPACITY = 0.95;

export class MfpsRenderer {
	private liveMfps: FeatureGroup<MfpDisplay> = new FeatureGroup<MfpDisplay>();
	private liveMfpToArea: Map<string, MfpDisplay> = new Map<string, MfpDisplay>();
	private filteredMfps: { [key: string]: true } = {};
	private currentFilter: Filter | null;
	private draggingMfpId: string;
	private timer: number;
	private mfps$: Subscription;
	private filter$: Subscription;

	constructor(
		private map: L.Map,
		mfps: Observable<Map<string, Mfp>>,
		filter: Observable<Filter>,
		private trackingMfp: string,
		private expirationTimeSec: number,
		private dwellTimeSec: number,
		private mapEmitter: EventEmitter<MapEvents> | undefined,
		private zone: NgZone,
		private log: NGXLogger,
	) {
		this.liveMfps.addTo(this.map);

		if (this.expirationTimeSec > 0) {
			// TODO: Investigate why protractor tests get stuck when using a timer that is captured by the Angular Zone.
			this.zone.runOutsideAngular(() => {
				this.timer = window.setInterval(() => this.pruneUnresponsiveMfps(), 1000);
			});
		}

		this.mfps$ = mfps.subscribe(this.updateMfps.bind(this));
		this.filter$ = filter
			.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
			.subscribe(this.updateFilter.bind(this));
	}

	/**
	 * We check every second if any MFP's have not been responsive in a while.
	 * After one minute an MFP is suspected to be dead. At that point we begin fading it out over a minute.
	 * Finally after 2 minutes we destroy the Layer.
	 */
	pruneUnresponsiveMfps() {
		this.liveMfpToArea.forEach((mfp: MfpDisplay) => {
			const timeUpdated = mfp.mfpState.getTimeSinceLastUpdated();
			if (timeUpdated <= this.expirationTimeSec / 2) {
				mfp.updateOpacity(MFP_DEFAULT_OPACITY);
			} else if (timeUpdated <= this.expirationTimeSec) {
				mfp.updateOpacity(((this.expirationTimeSec - timeUpdated) / 60) * MFP_DEFAULT_OPACITY);
			} else {
				// Remove the layer, a new one will get created if needed.
				this.destroyMfp(mfp);
			}
		});
	}

	private canRender(mfp: Mfp) {
		return mfp.isChuck() && !mfp.isLost() && !mfp.isOffline(this.expirationTimeSec);
	}

	private updateFilter(filter: Filter = { ids: [], name: '', color: '' }) {
		this.currentFilter = filter;
		this.filteredMfps = filter
			? filter.ids.reduce((map, mfpId) => ((map[mfpId] = true), map), {})
			: {};
		this.liveMfpToArea.forEach(this.updateMfpFilter.bind(this));
	}

	private updateMfps(mfps: Map<string, Mfp>) {
		mfps.forEach((mfp: Mfp, key: string) => {
			// Do not display MFPs that do not have a pose or that are not chucks.
			let mfpDisplay: MfpDisplay = this.liveMfpToArea.get(key);
			if (!this.canRender(mfp)) {
				if (mfpDisplay) {
					this.destroyMfp(mfpDisplay);
				}
			} else {
				if (!mfpDisplay) {
					mfpDisplay = this.createMfp(mfp, key);
				} else if (
					this.draggingMfpId !== mfp.id &&
					!isEqual(
						pick(mfpDisplay.mfpState, MfpDisplay.getRenderingFields()),
						pick(mfp, MfpDisplay.getRenderingFields()),
					)
				) {
					// If the mfp is currently dragged, we don't update it until it is dropped.
					// Do not update if the mfp hasn't changed.
					// We only compare the fields that matter for drawing instead of everything.
					mfpDisplay.setState(mfp, this.trackingMfp === key);
					if (this.trackingMfp === key) {
						this.trackMfp(mfpDisplay);
					}
				}
			}
		});
	}

	private createMfp(mfp: Mfp, key: string) {
		this.log.trace('Mfp New', mfp);
		const mfpDisplay = new MfpDisplay(mfp, this.dwellTimeSec, {
			pane: 'mfpPane',
			opacity: MFP_DEFAULT_OPACITY,
			interactive: true,
		});
		this.liveMfps.addLayer(mfpDisplay);
		mfpDisplay.updateOpacity(MFP_DEFAULT_OPACITY);
		this.updateMfpFilter(mfpDisplay, key);

		this.liveMfpToArea.set(key, mfpDisplay);
		if (this.mapEmitter) {
			mfpDisplay.on('dragstart', () => {
				this.draggingMfpId = mfpDisplay.id;
				this.mapEmitter.emit({ type: 'mfp-drag-start', mfpId: mfpDisplay.id });
			});
			mfpDisplay.on('dragend', () => {
				// emit the move event
				const latLng = mfpDisplay.getLatLng();
				const pose = new Pose(latLng.lng, latLng.lat, mfpDisplay.mfpState.pose.orientation);
				this.mapEmitter.emit({ type: 'mfp-drag-end', mfpId: mfpDisplay.id, pose });
				this.draggingMfpId = '';
			});
		}
		return mfpDisplay;
	}

	private destroyMfp(mfpDisplay: MfpDisplay) {
		this.liveMfps.removeLayer(mfpDisplay);
		this.liveMfpToArea.delete(mfpDisplay.id);
		mfpDisplay.off();
		mfpDisplay.remove();
	}

	private updateMfpFilter(mfp: MfpDisplay, key: string) {
		const isHighlighted = this.filteredMfps.hasOwnProperty(key);
		mfp.updateOpacity(
			undefined,
			Boolean(this.currentFilter && this.currentFilter.ids.length && !isHighlighted),
		);
		mfp.setHighlightColor(isHighlighted && this.currentFilter ? this.currentFilter.color : null);
	}

	setFocus(focusedLayer: string) {
		const lastTrackedMfp = this.liveMfpToArea.get(this.trackingMfp);
		const trackedMfp = this.liveMfpToArea.get(focusedLayer);
		if (lastTrackedMfp === trackedMfp) {
			return;
		}
		if (lastTrackedMfp) {
			lastTrackedMfp.setState(lastTrackedMfp.mfpState, false);
		}
		if (trackedMfp) {
			trackedMfp.setState(trackedMfp.mfpState, true);
			this.trackMfp(this.liveMfpToArea.get(focusedLayer));
		}
		this.trackingMfp = focusedLayer;
	}

	private trackMfp(mfpDisplay: MfpDisplay) {
		if (!this.map.getBounds().contains(mfpDisplay.getBounds())) {
			const oldMaxBounds = this.map.options.maxBounds; // temporarily disable map._limitCenter
			this.map.options.maxBounds = undefined;
			this.map.panTo(mfpDisplay.getLatLng(), { animate: true });
			this.map.options.maxBounds = oldMaxBounds;
		}
	}

	findMfp(id: string): MfpDisplay {
		return this.liveMfpToArea.get(id);
	}

	onDestroy() {
		this.liveMfps.remove();

		clearInterval(this.timer);

		this.mfps$.unsubscribe();
		this.filter$.unsubscribe();
	}
}
