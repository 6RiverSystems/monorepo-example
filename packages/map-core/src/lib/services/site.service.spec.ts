import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { SiteService } from './site.service';

describe('SiteService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [SiteService],
		});
	});

	it('should be created', inject([SiteService], (service: SiteService) => {
		expect(service).toBeTruthy();
	}));
});
