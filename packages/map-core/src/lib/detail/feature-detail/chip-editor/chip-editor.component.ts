import {
	Component,
	Input,
	OnChanges,
	OnInit,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
} from '@angular/core';
import { FormArray, Validators, FormControl, FormBuilder } from '@angular/forms';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FeatureComponent } from '../feature.component';

/**
 * Allows editing of a list of strings which automatically tokenize.
 */
@Component({
	selector: 'map-core-chip-editor',
	templateUrl: './chip-editor.component.html',
	styleUrls: ['./chip-editor.component.scss'],
})
export class ChipEditorComponent extends FeatureComponent implements OnChanges, OnInit {
	@ViewChild('labelInput', { static: true }) labelInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

	@Input() list: string[];
	@Input() key = 'labels';
	@Input() placeholder: string;
	@Input() chips: ReadonlyArray<string> = [];

	readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

	visible = true;
	selectable = true;
	removable = true;
	disabled = false;
	addOnBlur = true;
	filteredLabels: Observable<string[]>;
	inputControl = new FormControl(); // For entering new chips using the keyboard

	constructor(protected fb: FormBuilder, protected ref: ChangeDetectorRef) {
		super(fb, ref);
	}

	ngOnInit() {
		this.form.addControl(this.key, this.fb.array(this.list));

		if (!this.readOnly) {
			this.filteredLabels = this.inputControl.valueChanges.pipe(
				takeUntil(this.ngUnsubscribe),
				startWith(null),
				map((label: string | null) => (label ? this.filter(label) : this.chips.slice())),
			);
		} else {
			this.form.disable();
			this.selectable = this.removable = !this.readOnly;
			this.disabled = this.readOnly;
		}
	}

	ngOnChanges() {
		// Must recreate label form controls in case there are a different number of items than before
		this.form.setControl(this.key, this.fb.array(this.list.filter(label => label !== '')));
	}

	private filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.chips.filter(label => label.toLowerCase().includes(filterValue));
	}

	/**
	 * Add an input for a new item
	 */
	add(event: MatChipInputEvent): void {
		// Add label only when MatAutocomplete is not open
		// To make sure this does not conflict with OptionSelected Event
		if (!this.matAutocomplete.isOpen) {
			const input = event.input;
			const value = (event.value || '').trim();

			// Add our label
			if (value && !this.formItems.value.includes(value)) {
				this.formItems.push(this.fb.control(value));
				// Reset the input value
				if (input) {
					input.value = '';
				}

				this.inputControl.setValue(null);
			}
		}
	}

	/**
	 * Remove an item
	 * @param index An index of an item in the form
	 */
	remove(label: string, index: number): void {
		this.formItems.removeAt(index);
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		const newVal = event.option.viewValue.trim();
		if (!this.formItems.value.includes(newVal)) {
			this.formItems.push(this.fb.control(newVal));
		}
		this.labelInput.nativeElement.value = '';
		this.inputControl.setValue(null);
	}

	/**
	 * Convenience accessor for array of label form controls
	 */
	get formItems(): FormArray {
		return this.form.get(this.key) as FormArray;
	}
}
