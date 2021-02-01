import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [UsersService],
		});
	});

	it('should be created', inject([UsersService], (service: UsersService) => {
		expect(service).toBeTruthy();
	}));
});
