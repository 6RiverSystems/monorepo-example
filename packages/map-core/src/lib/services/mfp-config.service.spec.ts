import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { MfpConfigService } from './mfp-config.service';

describe('MfpConfigService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MfpConfigService],
		});
	});

	it('should be created', inject([MfpConfigService], (service: MfpConfigService) => {
		expect(service).toBeTruthy();
	}));
});
