import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AreaPositionEditorComponent } from './area-position-editor/area-position-editor.component';
import { ChipEditorComponent } from './chip-editor/chip-editor.component';
import { MaterialModule } from '../../material.module';

const components: NgModule['declarations'] = [AreaPositionEditorComponent, ChipEditorComponent];

@NgModule({
	imports: [CommonModule, MaterialModule, ReactiveFormsModule],
	declarations: components,
	exports: components,
})
export class FeatureDetailSharedModule {}
