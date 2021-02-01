import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { CostAreaDetailComponent } from './cost-area-detail.component';
import { TestModule } from '../../../test.module';
import { CostArea } from '../../../class/mapstack/CostArea';
import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';

describe('CostAreaDetailComponent', () => {
	let component: CostAreaDetailComponent;
	let fixture: ComponentFixture<CostAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CostAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new CostArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
