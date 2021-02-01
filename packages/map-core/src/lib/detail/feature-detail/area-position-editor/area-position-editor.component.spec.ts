import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TestModule } from '../../../test.module';
import { AreaPositionEditorComponent } from './area-position-editor.component';
import { getRandomLatLngBounds } from '../../../test/lat-lng-bounds-factory';

describe('AreaPositionEditorComponent', () => {
	let component: AreaPositionEditorComponent;
	let fixture: ComponentFixture<AreaPositionEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AreaPositionEditorComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.form = formBuilder.group({});
		component.position = getRandomLatLngBounds();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
