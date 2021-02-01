import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';

import { TestModule } from '../test.module';
import { NotificationService, NotificationType } from './notification.service';

@Component({
	selector: 'snack-bar-container',
	template: '',
})
export class ContainerComponent {}

describe('NotificationService', () => {
	let fixture: ComponentFixture<ContainerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ContainerComponent],
			imports: [TestModule],
			providers: [NotificationService],
		});

		fixture = TestBed.createComponent(ContainerComponent);
		fixture.detectChanges();
	});

	it('should be created', inject([NotificationService], (service: NotificationService) => {
		expect(service).toBeTruthy();
	}));

	it('should show notification', inject([NotificationService], (service: NotificationService) => {
		['warning', 'error', 'info', 'success'].forEach((type: NotificationType) => {
			const message = `${type}: This is a test`;
			service.showNotification(message, type);
			fixture.detectChanges();
			const containerElement = document.querySelector(
				`.notification-${type} .content-left .message`,
			);
			expect(containerElement.innerHTML).toContain(`${type}: This is a test`); // Expected snack bar container to show the message
			const iconElement = document.querySelector(
				`.notification-${type} .content-left .message mat-icon`,
			);
			expect(iconElement.innerHTML).toContain(
				{
					warning: 'warning',
					error: 'error',
					info: 'info',
					success: 'check_circle',
				}[type],
			); // Expected snack bar container to show icon
			expect(
				document.querySelector(`.notification-${type} .content-right mat-button`),
			).toBeDefined(); // Expected dismiss button
		});
	}));
});
