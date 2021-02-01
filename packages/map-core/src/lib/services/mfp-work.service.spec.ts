import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { MfpWorkflowService } from './mfp-work.service';

describe('MfpWorkflowService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MfpWorkflowService],
		});
	});

	it('should be created', inject([MfpWorkflowService], (service: MfpWorkflowService) => {
		expect(service).toBeTruthy();
	}));
});
