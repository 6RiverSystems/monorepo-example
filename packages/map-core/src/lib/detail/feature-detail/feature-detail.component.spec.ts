import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { getRandomLatLng } from '../../test/lat-lng-factory';
import { FeatureDetailComponent } from './feature-detail.component';
import { TestModule } from '../../test.module';
import { Aisle } from '../../class/mapstack/Aisle';
import { DisplayOptionsService } from '../../services/display-options.service';

describe('FeatureDetailComponent', () => {
	let component: FeatureDetailComponent;
	let fixture: ComponentFixture<FeatureDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [DisplayOptionsService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeatureDetailComponent);
		component = fixture.componentInstance;
		component.feature = new Aisle([getRandomLatLng(), getRandomLatLng()]);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
