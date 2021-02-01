import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { KeepOutAreaDetailComponent } from './keep-out-area-detail.component';
import { TestModule } from '../../../test.module';
import { KeepOutArea } from '../../../class/mapstack/KeepOutArea';

describe('KeepOutAreaDetailComponent', () => {
	let component: KeepOutAreaDetailComponent;
	let fixture: ComponentFixture<KeepOutAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(KeepOutAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new KeepOutArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
