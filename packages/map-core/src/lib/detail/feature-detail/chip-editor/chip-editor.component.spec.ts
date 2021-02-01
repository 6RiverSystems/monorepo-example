import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TestModule } from '../../../test.module';
import { ChipEditorComponent } from './chip-editor.component';

describe('ChipEditorComponent', () => {
	let component: ChipEditorComponent;
	let fixture: ComponentFixture<ChipEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChipEditorComponent);
		const formBuilder: FormBuilder = TestBed.get(FormBuilder);
		component = fixture.componentInstance;
		component.form = formBuilder.group({});
		component.list = [];
		component.key = 'labels';
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
		const input = fixture.debugElement.query(By.css('input'));
		expect(input).toBeTruthy();
		expect(component.form.disabled).toBeFalsy();
	});

	it('should disable the controls when readonly', () => {
		component.readOnly = true;
		fixture.detectChanges();
		const input = fixture.debugElement.query(By.css('input'));
		expect(input).toBeFalsy();
		expect(component.form.disabled).toBeTruthy();
	});
});
