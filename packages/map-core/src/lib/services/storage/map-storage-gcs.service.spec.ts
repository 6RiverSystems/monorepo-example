import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../../test.module';
import { MapStorageGoogleCloudService } from './map-storage-gcs.service';

describe('MapStorageGoogleCloudService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MapStorageGoogleCloudService],
		});
	});

	it('should be created', inject(
		[MapStorageGoogleCloudService],
		(service: MapStorageGoogleCloudService) => {
			expect(service).toBeTruthy();
		},
	));
});
