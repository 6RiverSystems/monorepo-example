import { AppPage } from './app.po';

export class DetailPage extends AppPage {
	start(mapName = 'empty') {
		return this.navigateTo(mapName);
	}

	getFirstWorkflowPoint() {
		return cy.get('.stack-workflow-point');
	}

	openDetail(layerClass: string, featureType: string) {
		const layer = cy.get(layerClass);
		layer.click();
		return this.isFeatureDetailOpen(featureType);
	}

	isFeatureDetailOpen(featureType: string) {
		// Ensure that Feature Detail Element is not taking too long to appear in the DOM
		return cy.get(`site-map-detail map-core-feature-detail ${featureType}`, { timeout: 30000 });
	}

	getChipEditorInput(key: string) {
		return cy.get(`map-core-chip-editor[key=${key}] .mat-chip-input`);
	}

	typeIntoChipEditor(key: string, text: string) {
		return this.getChipEditorInput(key).type(text);
	}

	hasChipWithValue(value: string) {
		return cy.get('.mat-chip').contains(value.trim());
	}

	deleteChipWithValue(value: string) {
		return cy
			.get('.mat-chip')
			.contains(value.trim())
			.children('.mat-chip-remove')
			.click();
	}

	deleteAllChips(key: string) {
		cy.get('.mat-chip .mat-chip-remove').click();
		return this.getChipEditorInput(key).type(' ');
	}

	getAllChips() {
		return cy.get('.mat-chip');
	}

	getAutoCompleteFields() {
		// Ensure Auto Complete is taking too long to appear in the DOM
		cy.get('.mat-autocomplete-visible', { timeout: 30000 });
		return cy.get('.mat-autocomplete-visible .mat-option-text');
	}
}
