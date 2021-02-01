import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import {
	MfpsEffects,
	MapStackEffects,
	WorkflowPointEffects,
	DetailEffects,
	UsersEffects,
} from '@sixriver/map-core';

@NgModule({
	imports: [
		EffectsModule.forRoot([
			MfpsEffects,
			MapStackEffects,
			WorkflowPointEffects,
			DetailEffects,
			UsersEffects,
		]),
	],
	exports: [EffectsModule],
})
export class AppEffectsModule {}
