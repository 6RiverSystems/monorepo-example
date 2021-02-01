import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';
import { ImpassableAreaDetailComponent } from './impassable-area-detail.component';
import { TestModule } from '../../../test.module';
import { ImpassableArea } from '../../../class/mapstack/ImpassableArea';

describe('ImpassableAreaDetailComponent', () => {
	let component: ImpassableAreaDetailComponent;
	let fixture: ComponentFixture<ImpassableAreaDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpassableAreaDetailComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.feature = new ImpassableArea(getRandomLatLngBounds());
		component.form = formBuilder.group({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
