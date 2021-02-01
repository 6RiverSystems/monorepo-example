import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { SimulatedObjectDetailComponent } from './simulated-object-detail.component';
import { TestModule } from '../../../test.module';
import { SimulatedObject } from '../../../class/mapstack/SimulatedObject';

describe('SimulatedObjectDetailComponent', () => {
	let component: SimulatedObjectDetailComponent;
	let fixture: ComponentFixture<SimulatedObjectDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SimulatedObjectDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new SimulatedObject(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
