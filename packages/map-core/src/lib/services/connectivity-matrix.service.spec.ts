import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { ConnectivityMatrixService } from './connectivity-matrix.service';

describe('ConnectivityMatrixService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [ConnectivityMatrixService],
		});
	});

	it('should be created', inject(
		[ConnectivityMatrixService],
		(service: ConnectivityMatrixService) => {
			expect(service).toBeTruthy();
		},
	));
});
