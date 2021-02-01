import { Component, OnDestroy, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
	selector: 'notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnDestroy {
	message: string;
	icon: string;
	dismiss: () => void;

	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
		this.message = data.message;
		this.icon = data.icon;
		this.dismiss = data.dismiss;
	}

	ngOnDestroy() {
		delete this.dismiss;
	}
}
