import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { NotificationComponent } from '../notification/notification.component';

export type NotificationType = 'warning' | 'error' | 'info' | 'success';

@Injectable()
export class NotificationService {
	constructor(private snackBar: MatSnackBar) {}

	showNotification(msg: string, type: NotificationType, time?: number) {
		const data = {
			message: msg,
			icon: {
				warning: 'warning',
				error: 'error',
				info: 'info',
				success: 'check_circle',
			}[type],
			dismiss: () => snackbarRef.dismiss(),
		};

		const snackbarRef = this.snackBar.openFromComponent(NotificationComponent, <MatSnackBarConfig>{
			panelClass: 'notification-' + type,
			horizontalPosition: 'left',
			verticalPosition: 'bottom',
			duration: time || 5000,
			data,
		});
	}
}
