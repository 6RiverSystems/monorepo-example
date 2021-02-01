import { TestBed, inject } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { MfpsService } from './mfps.service';

describe('MfpsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MfpsService],
		});
	});

	it('should be created', inject([MfpsService], (service: MfpsService) => {
		expect(service).toBeTruthy();
	}));

	it('should convert legacy faults to fault codes', inject(
		[MfpsService],
		(service: MfpsService) => {
			const faultCodes = service.transformLegacyFaults({
				faults: [
					[
						11,
						{
							code: 11,
							resolution: 5,
							id: 'cc957c40-3c36-46af-8b80-0965ef883d3d',
							timestamp: new Date(),
						},
					],
					[
						3,
						{
							code: 3,
							resolution: 2,
							id: 'bb93967d-9c07-48fe-a5dc-76538cba2b19',
							timestamp: new Date(),
						},
					],
				],
			});
			expect(Object.keys(faultCodes)).toEqual(['PAUSE', 'RPM_MESSAGE_TIMEOUT']);
			expect(faultCodes['PAUSE'].code).toEqual('PAUSE');
			expect(faultCodes['PAUSE'].resolution).toEqual('FATAL');
			expect(faultCodes['RPM_MESSAGE_TIMEOUT'].code).toEqual('RPM_MESSAGE_TIMEOUT');
			expect(faultCodes['RPM_MESSAGE_TIMEOUT'].resolution).toEqual('CHECK_CABLE');
			const faults = service.transformLegacyFaults({ faultCodes });
			expect(faultCodes).toEqual(faults);
		},
	));
});
