import { Test } from '@nestjs/testing';

import { AppService } from './app.service';
import { HttpModule } from '@nestjs/common';

describe('AppService', () => {
	let service: AppService;

	beforeAll(async () => {
		const app = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [AppService],
		}).compile();

		service = app.get<AppService>(AppService);
	});
	describe('getData', () => {
		const result = {};
		it('should return a map stack', async () => {
			jest.spyOn(service, 'getData').mockImplementation(() => {
				return Promise.resolve({ message: 'success' });
			});
			expect(await service.getData('')).toStrictEqual({ message: 'success' });
		});
	});
	//test for expected all sites response
	describe('getConfiguration', () => {
		it('should return grm site information', async () => {
			const result = [{ name: '', updatedAt: '', globalConfig: { googleCloudStorage: {} } }];
			jest.spyOn(service, 'requestGrmConfig').mockImplementation(() => {
				return Promise.resolve({ data: result });
			});
			expect(await service.getConfiguration(null)).toStrictEqual([
				{ site: '', updatedAt: '', googleCloudStorage: {} },
			]);
		});
	});
	//test for expected single siteId
	describe('getConfiguration', () => {
		it('should return grm site information', async () => {
			const result = [{ name: 'siteId', updatedAt: '', globalConfig: { googleCloudStorage: {} } }];
			jest.spyOn(service, 'requestGrmConfig').mockImplementation(() => {
				return Promise.resolve({ data: result });
			});
			expect(await service.getConfiguration('siteId')).toStrictEqual({
				site: 'siteId',
				updatedAt: '',
				googleCloudStorage: {},
			});
		});
	});
});
