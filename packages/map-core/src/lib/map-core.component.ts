import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Store, select } from '@ngrx/store';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MapCoreState } from './reducers';
import { DetailClose } from './detail/detail.actions';
import { MapEvents } from './interfaces/events';
import { DisplayOptionsService } from './services/display-options.service';

@Component({
	selector: 'map-core',
	templateUrl: './map-core.component.html',
	styleUrls: ['./map-core.component.scss'],
})
export class MapCoreComponent implements OnDestroy, OnInit {
	@ViewChild(MatDrawer, { static: true }) sidenav: MatDrawer;
	@Output() mapEvent = new EventEmitter<MapEvents>();

	private ngUnsubscribe = new Subject();

	constructor(
		private store: Store<MapCoreState>,
		public displayOptionsService: DisplayOptionsService,
	) {	}
	ngOnInit() {
		// Subscribe to the open state and toggle the sidenav when it changes
		this.store
			.pipe(select('detail', 'isOpen'), takeUntil(this.ngUnsubscribe))
			.subscribe((isOpen: boolean) => {
				this.sidenav.toggle(isOpen);
			});
	}

	/**
	 * Handle sidenav close events
	 */
	onClose() {
		this.store.dispatch(new DetailClose());
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
