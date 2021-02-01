/**
 * The Workflow Point Configurator component is used to configure
 * select paramaters of the Workflow Point. The component itself
 * renders a configuration form based on the DisplayOptions specified in the
 * parent application to MapCore.
 *
 * For instance: DisplayOptions.WorkflowPointStatusToggleEnabled, and
 * DisplayOptions.QueueDepthToggleEnabled are added to the set of DisplayOptions
 * defined in the parent application. These options in particular will allow users to
 * configure whether or not the WorkflowPoint is enabled, and the queue depth of the WorkflowPoint.
 */

import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { combineUrls } from '@sixriver/url-fns';

import { WorkflowPointService } from '../../../../services/workflow-point.service';
import { NotificationService } from '../../../../services/notification.service';
import { MAP_CORE_CONFIG, MapCoreConfig } from '../../../../interfaces/config';
import { WorkflowPointState } from '../../../../interfaces/workflow-point-state';
import { WorkflowPoint } from '../../../../class/mapstack/WorkflowPoint';
import { DisplayOptions } from '../../../../interfaces/map-display-options';
import { MapStackStateService } from '../../../../services/map-stack-state.service';
import { DisplayOptionsService } from '../../../../services/display-options.service';

@Component({
	selector: 'workflow-point-configurator',
	templateUrl: './workflow-point-configurator.component.html',
	styleUrls: ['./workflow-point-configurator.component.scss'],
})
export class WorkflowPointConfiguratorComponent implements OnInit, OnChanges {
	@Input() feature: WorkflowPoint;

	public workflowPointState: WorkflowPointState;
	public form: FormGroup;
	public showDisclaimer = false;
	public patchingWorkflowPoint = false;
	public readonly uploadingMessage = 'Updating workflow point state. This may take a few seconds.';
	public readonly maxQueueDepth = 999;
	private mapManagerBaseUrl: string;

	constructor(
		private readonly fb: FormBuilder,
		private http: HttpClient,
		private displayOptionsService: DisplayOptionsService,
		private workflowPointService: WorkflowPointService,
		public notificationService: NotificationService,
		public mapStackStateService: MapStackStateService,
		@Inject(MAP_CORE_CONFIG) private readonly mapCoreConfig: BehaviorSubject<MapCoreConfig>,
	) {
		this.mapManagerBaseUrl = this.mapCoreConfig.getValue().mapManagerBaseUrl;
		this.form = new FormGroup({});
	}

	ngOnInit() {
		if (this.isWorkflowPointToggleEnabled) {
			this.form.addControl('enabledControl', this.fb.control(false, Validators.required));
		}

		if (this.isQueueDepthToggleEnabled) {
			this.form.addControl(
				'queueDepthControl',
				this.fb.control(0, [
					Validators.required,
					Validators.compose([
						Validators.min(1),
						Validators.max(this.maxQueueDepth),
						Validators.pattern('^[0-9]+$'),
					]),
				]),
			);
		}
		this.resetForm();
	}

	resetForm() {
		this.getWorkflowPointState();
		this.toggleDisclaimer(false);
		this.form.markAsPristine();
		this.patchingWorkflowPoint = false;
	}

	getWorkflowPointState() {
		if (!this.feature) {
			return;
		}
		this.workflowPointService
			.getWorkflowPointState(this.feature.name)
			.subscribe((workflowPointState: WorkflowPointState) => {
				if (this.isWorkflowPointToggleEnabled) {
					this.mapStackStateService.updateWorkflowPointState(workflowPointState);
				}
				this.setWorkflowPointState(workflowPointState);
			});
	}

	setWorkflowPointState(workflowPointState: WorkflowPointState) {
		this.workflowPointState = workflowPointState;

		if (this.isWorkflowPointToggleEnabled) {
			this.form.patchValue({
				enabledControl: this.workflowPointState.enabled,
			});
		}

		if (this.isQueueDepthToggleEnabled) {
			this.form.patchValue({
				queueDepthControl: this.workflowPointState.maxReservationCount,
			});

			if (workflowPointState.maxReservationCount > this.maxQueueDepth) {
				this.form.patchValue({
					queueDepthControl: this.maxQueueDepth,
				});
			}

			this.updateQueueDepthControl();
		}
	}

	patchWorkflowPointState() {
		if (!this.feature) {
			return;
		}

		const mapPointUrl = combineUrls(this.mapManagerBaseUrl, '/v1/MapPointConfigOverrides');

		this.patchingWorkflowPoint = true;

		this.http
			.patch(mapPointUrl, {
				mapPointName: this.feature.name,
				maxReservationCount: this.queueDepth,
				enabled: this.enabled,
			})
			.pipe(
				retry(2),
				catchError(this.handleError.bind(this, 'Failed to set workflow point state.')),
			)
			.subscribe(() => {
				this.resetForm();
				this.notificationService.showNotification('Workflow point updated!', 'success', 5000);
				this.patchingWorkflowPoint = false;
			});
	}

	handleError(msg: string) {
		this.notificationService.showNotification(msg, 'error', 7000);
	}

	get enabledControl(): FormControl {
		return this.form.get('enabledControl') as FormControl;
	}

	get enabled(): boolean {
		return this.isWorkflowPointToggleEnabled
			? this.enabledControl.value
			: this.workflowPointState.enabled;
	}

	get queueDepthControl(): FormControl {
		return this.form.get('queueDepthControl') as FormControl;
	}

	get queueDepth(): number {
		return this.isQueueDepthToggleEnabled
			? this.queueDepthControl.value
			: this.workflowPointState.maxReservationCount;
	}

	get isQueueDepthToggleEnabled(): boolean {
		return !!this.displayOptionsService.get(DisplayOptions.QueueDepthToggleEnabled);
	}

	get isWorkflowPointToggleEnabled(): boolean {
		return !!this.displayOptionsService.get(DisplayOptions.WorkflowStatusToggleEnabled);
	}

	updateQueueDepthControl() {
		if (this.isQueueDepthToggleEnabled) {
			this.enabled ? this.queueDepthControl.enable() : this.queueDepthControl.disable();
		}
	}

	toggleDisclaimer(open: boolean) {
		this.showDisclaimer = open;
	}

	ngOnChanges() {
		this.resetForm();
	}
}
