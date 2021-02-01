import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { StayOnPathAreaDetailComponent } from './stay-on-path-area-detail.component';
import { TestModule } from '../../../test.module';
import { StayOnPathArea } from '../../../class/mapstack/StayOnPathArea';

describe('StayOnPathAreaDetailComponent', () => {
	let component: StayOnPathAreaDetailComponent;
	let fixture: ComponentFixture<StayOnPathAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StayOnPathAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new StayOnPathArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
