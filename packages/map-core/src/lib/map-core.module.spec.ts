import { async, TestBed } from '@angular/core/testing';

import { MapCoreModule } from './map-core.module';

describe('MapCoreModule', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MapCoreModule],
		}).compileComponents();
	}));

	it('should create', () => {
		expect(MapCoreModule).toBeDefined();
	});
});
