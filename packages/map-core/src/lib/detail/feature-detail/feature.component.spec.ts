import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { getRandomLatLng } from '../../test/lat-lng-factory';
import { FeatureComponent } from './feature.component';
import { TestModule } from '../../test.module';
import { Aisle } from '../../class/mapstack/Aisle';

describe('FeatureComponent', () => {
	let component: FeatureComponent;
	let fixture: ComponentFixture<FeatureComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeatureComponent);
		component = fixture.componentInstance;
		component.feature = new Aisle([getRandomLatLng(), getRandomLatLng()]);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
