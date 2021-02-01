import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Chance } from 'chance';
import { IUserTaskData, UserTaskType } from '@sixriver/cfs_models';

import { TestModule } from '../../../test.module';
import { JobComponent } from './job.component';
import { Job } from '../../../interfaces/job';

describe('JobComponent', () => {
	const chance = new Chance();
	let component: JobComponent;
	let fixture: ComponentFixture<JobComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JobComponent);
		component = fixture.componentInstance;
		// TODO export and use the test factories in CFS Models
		const lines: IUserTaskData[] = [
			{
				status: chance.string(),
				type: UserTaskType.BatchPick,
				doneQuantity: chance.integer(),
				quantity: chance.integer(),
				jobId: chance.string(),
				userTaskBatchId: chance.string(),
				startedAt: chance.date(),
				completedAt: chance.date(),
				moveStartedAt: chance.date(),
				moveEndedAt: chance.date(),
				grabStartedAt: chance.date(),
				grabEndedAt: chance.date(),
				putStartedAt: chance.date(),
				putEndedAt: chance.date(),
				data: {},
				sourceLocId: chance.string(),
				destinationLocId: chance.string(),
				userId: chance.string(),
				productTypeId: chance.string(),
				containerTypeId: chance.string(),
			},
		];
		component.job = new Job({ lines });
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
