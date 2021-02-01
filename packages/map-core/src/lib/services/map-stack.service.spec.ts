import { TestBed, inject } from '@angular/core/testing';

import { MapStackService } from './map-stack.service';
import { TestModule } from '../test.module';
import { DisplayOptionsService } from './display-options.service';

describe('MapStackService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MapStackService, DisplayOptionsService],
		});
	});

	it('should be created', inject([MapStackService], (service: MapStackService) => {
		expect(service).toBeTruthy();
	}));
});
