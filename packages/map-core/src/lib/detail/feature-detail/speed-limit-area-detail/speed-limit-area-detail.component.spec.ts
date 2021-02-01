import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { SpeedLimitAreaDetailComponent } from './speed-limit-area-detail.component';
import { TestModule } from '../../../test.module';
import { SpeedLimitArea } from '../../../class/mapstack/SpeedLimitArea';

describe('SpeedLimitAreaDetailComponent', () => {
	let component: SpeedLimitAreaDetailComponent;
	let fixture: ComponentFixture<SpeedLimitAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpeedLimitAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new SpeedLimitArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
