import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { WeightedAreaDetailComponent } from './weighted-area-detail.component';
import { TestModule } from '../../../test.module';
import { WeightedArea } from '../../../class/mapstack/WeightedArea';

describe('WeightedAreaDetailComponent', () => {
	let component: WeightedAreaDetailComponent;
	let fixture: ComponentFixture<WeightedAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WeightedAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new WeightedArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
