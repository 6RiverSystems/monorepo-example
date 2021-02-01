import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../../test.module';
import { MapStorageManagerService } from './map-storage-manager.service';

describe('MapStorageManagerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MapStorageManagerService],
		});
	});

	it('should be created', inject(
		[MapStorageManagerService],
		(service: MapStorageManagerService) => {
			expect(service).toBeTruthy();
		},
	));

	it('should allow calling loadFile with no arguments', inject(
		[MapStorageManagerService],
		(service: MapStorageManagerService) => {
			expect(function() {
				service.loadFile();
			}).not.toThrow();
		},
	));
});
