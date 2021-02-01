import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { QueueAreaDetailComponent } from './queue-area-detail.component';
import { TestModule } from '../../../test.module';
import { QueueArea } from '../../../class/mapstack/QueueArea';

describe('QueueAreaDetailComponent', () => {
	let component: QueueAreaDetailComponent;
	let fixture: ComponentFixture<QueueAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QueueAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new QueueArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
