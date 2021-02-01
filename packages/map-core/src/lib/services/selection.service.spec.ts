import { TestBed, inject } from '@angular/core/testing';
import { v4 as uuid } from 'uuid';
import { SelectionReport } from '@sixriver/map-controller';

import { TestModule } from '../test.module';
import { SelectionService } from './selection.service';

const NUMOBJECTS = 10;
const objects = [];

describe('SelectionService', () => {
	for (let i = 0; i < NUMOBJECTS; i++) {
		objects.push(uuid());
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [SelectionService],
		});
	});

	it('should be created', inject([SelectionService], (service: SelectionService) => {
		expect(service).toBeTruthy();
		expect(objects.length).toEqual(NUMOBJECTS);
	}));

	it('should select', inject([SelectionService], (service: SelectionService) => {
		service.clear();

		service.select(objects[0]);
		expect(service.selected.size).toEqual(1);
		service.select(objects);
		expect(service.selected.size).toEqual(objects.length);
	}));

	it('should append to selection', inject([SelectionService], (service: SelectionService) => {
		service.clear();

		service.select(objects[0]);
		service.select([objects[1], objects[2]], true);

		expect(service.selected.size).toEqual(3);
	}));

	it('should deselect', inject([SelectionService], (service: SelectionService) => {
		service.clear();

		service.select(objects[0]);
		expect(service.selected.size).toEqual(1);
		service.deselect(objects[0]);
		expect(service.selected.size).toEqual(0);

		service.select(objects);
		service.deselect(objects);
		expect(service.selected.size).toEqual(0);
	}));

	it('should clear', inject([SelectionService], (service: SelectionService) => {
		service.clear();

		service.select(objects);
		expect(service.selected.size).toEqual(objects.length);
		service.clear();
		expect(service.selected.size).toEqual(0);
	}));

	it('should have a readonly public selection set', inject(
		[SelectionService],
		(service: SelectionService) => {
			service.clear();

			service.select(objects);
			expect(objects.length).toEqual(NUMOBJECTS);
			expect(service.selected.size).toEqual(objects.length);
			expect([...service.selected]).toEqual(objects);
			service.deselect(objects[0]);
			expect(service.selected.size).toBeLessThan(objects.length);
			service.clear();

			service.select(objects);
			const selectSet = service.selected;
			selectSet.delete(objects[1]);
			expect(selectSet.size).toBeLessThan(NUMOBJECTS);
			expect(selectSet.size).toBeLessThan(service.selected.size);
		},
	));

	it('should report when selection changes', inject(
		[SelectionService],
		(service: SelectionService) => {
			service.clear();

			let callbackCount = 0;
			let subscription = service.observe((report: SelectionReport) => {
				expect([...report.selected]).toEqual(objects);
				expect([...report.deltaSelected]).toEqual(objects);
				expect(report.deltaDeselected.size).toEqual(0);
				expect(report.primary).toEqual(objects[0]);
				callbackCount++;
			});
			service.select(objects);
			subscription.unsubscribe();

			service.clear();

			subscription = service.observe((report: SelectionReport) => {
				expect([...report.selected]).toEqual([objects[0]]);
				expect([...report.deltaSelected]).toEqual([objects[0]]);
				expect(report.deltaDeselected.size).toEqual(0);
				expect(report.primary).toEqual(objects[0]);
				callbackCount++;
			});
			service.select(objects[0]);
			subscription.unsubscribe();

			service.clear();
			service.select(objects);

			subscription = service.observe((report: SelectionReport) => {
				expect([...report.selected]).toEqual(objects.slice(1));
				expect([...report.deltaDeselected]).toEqual([objects[0]]);
				expect(report.deltaSelected.size).toEqual(0);
				expect(report.primary).toEqual(objects[1]);
				callbackCount++;
			});
			service.deselect(objects[0]);
			subscription.unsubscribe();
			expect(callbackCount).toEqual(3);
		},
	));
});
