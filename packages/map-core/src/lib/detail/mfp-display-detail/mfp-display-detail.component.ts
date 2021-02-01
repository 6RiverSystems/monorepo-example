import { Component, Input, DoCheck, Output, EventEmitter, OnInit } from '@angular/core';
import { KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IUserTaskData, IUtbData, UserTaskType } from '@sixriver/cfs_models';
import { uniq } from 'lodash-es';
import moment from 'moment';
import { Fault } from '@sixriver/mfp_lib_js/browser';

import { Mfp, Phase, WorkState } from '../../interfaces/mfp';
import { MfpDisplay } from '../../class/mapstack/MfpDisplay';
import { labels } from '../../i18n/labels';
import { User } from '../../interfaces/user';
import { MfpWorkflowService } from '../../services/mfp-work.service';
import { Job } from '../../interfaces/job';
import { MapCoreState } from '../../reducers';
import { UsersState } from '../../users/users.reducer';

@Component({
	selector: 'mfp-display-detail',
	templateUrl: './mfp-display-detail.component.html',
	styleUrls: ['./mfp-display-detail.component.scss'],
	providers: [MfpWorkflowService],
})
export class MfpDisplayDetailComponent implements DoCheck, OnInit {
	constructor(private differs: KeyValueDiffers, private store: Store<MapCoreState>) {
		this.users$ = this.store.pipe(select('users'));
	}

	get isPicking(): boolean {
		return this.getWorkPhase() === Phase.PICKING;
	}

	get hasFaults(): boolean {
		return this.getFaults().length > 0;
	}

	get hasWork(): boolean {
		return this.mfp.taskBatches.length > 0 && !!this.mfp.taskBatches[0].tasks;
	}
	@Input() layer: MfpDisplay = null;
	@Output() closeDetails = new EventEmitter();

	mfp: Mfp = null;

	jobBatches$: Observable<Job[][]>;
	users$: Observable<UsersState>;

	private layerDiffer: KeyValueDiffer<string, any>;

	/**
	 * Check if a task is related to picking
	 */
	static isPickTask(task: IUserTaskData): boolean {
		return <UserTaskType>task.type === UserTaskType.BatchPick;
	}
	/**
	 * Remove all non-picking tasks from a task batch
	 */
	static onlyPickTasks(taskBatch: IUtbData): IUtbData | void {
		if (!taskBatch.tasks) {
			return;
		}
		return {
			...taskBatch,
			tasks: taskBatch.tasks.filter(MfpDisplayDetailComponent.isPickTask),
		};
	}
	/**
	 * Group the tasks in a batch by jobs
	 * @description Workaround for not having direct access to jobs. Constructs synthetic jobs out of tasks.
	 */
	static groupByJob(batch: IUtbData): Job[] {
		const jobIds = uniq(batch.tasks.map(task => task.jobId));
		return jobIds.map((id: string) => {
			const lines = batch.tasks.filter(task => task.jobId === id);
			return new Job({ lines, assetTypes: batch.assetTypes });
		});
	}
	ngOnInit() {
		this.layerDiffer = this.differs.find(this.layer.mfpState).create();
	}

	ngDoCheck() {
		const changes = this.layerDiffer.diff(this.layer.mfpState);
		if (changes) {
			this.mfpChanged();
		}
	}

	mfpChanged() {
		if (this.layer) {
			this.mfp = this.layer.mfpState;
			this.jobBatches$ = new Observable(observer =>
				observer.next(
					this.mfp.taskBatches
						.map(MfpDisplayDetailComponent.onlyPickTasks)
						.map(MfpDisplayDetailComponent.groupByJob),
				),
			);
		}
	}

	getName(): string {
		return this.mfp.id || labels.unknown.mfpName;
	}

	getUserName(): Observable<string> {
		return this.users$.pipe(
			map((userState: UsersState) => {
				const user: User = userState.users.get(this.mfp.userId);

				if (!user) {
					return labels.unknown.userName;
				}
				return user.name;
			}),
		);
	}

	trackFaultById(index: number, item: { fault: string; code: string }) {
		return item.fault;
	}

	getFaults(): { fault: string; resolution: string }[] {
		const toLabel = (enumLiteral: string) => enumLiteral.toLowerCase().replace(/_/g, ' ');

		return Object.values(this.mfp.faults).map((fault: Fault) => ({
			fault: labels.FaultState.get(fault.code) || toLabel(fault.code),
			resolution: labels.FaultResolution.get(fault.resolution) || toLabel(fault.resolution),
		}));
	}

	getMotionState(): string {
		return labels.MotionState.get(this.mfp.motionState);
	}

	getWorkPhase(): string | null {
		return labels.Phase.get(<Phase>this.mfp.phase) || null;
	}

	getWorkState(): string {
		return labels.WorkState.get(<WorkState>this.mfp.state) || labels.unknown.workState;
	}

	getUpdated(): string {
		return moment(this.mfp.fieldUpdated['pose']).fromNow();
	}
}
