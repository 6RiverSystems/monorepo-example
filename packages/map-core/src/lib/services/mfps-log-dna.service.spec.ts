import { TestBed, inject } from '@angular/core/testing';

import { MfpsLogDnaService } from './mfps-log-dna.service';
import { TestModule } from '../test.module';

describe('MfpsLogDnaService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MfpsLogDnaService],
		});
	});

	it('should be created', inject([MfpsLogDnaService], (service: MfpsLogDnaService) => {
		expect(service).toBeTruthy();
	}));
});
