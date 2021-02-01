import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModule } from '../../../test.module';
import { JobsComponent } from './jobs.component';

describe('JobsComponent', () => {
	let component: JobsComponent;
	let fixture: ComponentFixture<JobsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JobsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
