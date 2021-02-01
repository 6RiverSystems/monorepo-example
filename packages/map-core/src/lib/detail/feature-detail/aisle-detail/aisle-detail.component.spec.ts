import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AisleDetailComponent } from './aisle-detail.component';
import { TestModule } from '../../../test.module';
import { Aisle } from '../../../class/mapstack/Aisle';
import { getRandomLatLng } from '../../../test/lat-lng-factory';

describe('AisleDetailComponent', () => {
	let component: AisleDetailComponent;
	let fixture: ComponentFixture<AisleDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AisleDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new Aisle([getRandomLatLng(), getRandomLatLng()]);
		component.feature.labels = [];
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
