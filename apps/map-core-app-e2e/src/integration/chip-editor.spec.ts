import { DetailPage } from '../support/feature-detail.po';

describe('map-core-app test chip-editor', () => {
	let detail: DetailPage;

	beforeEach(() => {
		detail = new DetailPage();
		return detail.start();
	});

	it('should be able to add custom labels', () => {
		detail.createWorkflowPoint();
		detail.openDetail('.stack-workflow-point', 'workflow-point-detail');
		detail.typeIntoChipEditor('labels', 'aaaa,goo bar smack-ss snake\n');

		detail.hasChipWithValue('aaaa');
		detail.hasChipWithValue('goo');
		detail.hasChipWithValue('bar');
		detail.hasChipWithValue('smack-s');
		detail.hasChipWithValue('snake');
	});

	it('should be able to delete labels', () => {
		detail.createWorkflowPoint();
		detail.openDetail('.stack-workflow-point', 'workflow-point-detail');
		detail.typeIntoChipEditor('labels', 'aaaa\n');

		detail.hasChipWithValue('aaaa');
		detail.deleteChipWithValue('aaaa');
		detail.getAllChips().should('not.exist');
	});

	it('should be able to select labels from a dropdown', () => {
		detail.createWorkflowPoint();
		detail.openDetail('.stack-workflow-point', 'workflow-point-detail');

		const chipEditor = detail.getChipEditorInput('labels');
		chipEditor.type('aaa\n');

		const fields = detail.getAutoCompleteFields().should('have.length.greaterThan', 10);
		fields.first().should('have.text', ' batchTakeoff ');
		fields.first().click();

		detail.hasChipWithValue('batchTakeoff');
	});

	it('should be able to filter labels when typing', () => {
		detail.createWorkflowPoint();
		detail.openDetail('.stack-workflow-point', 'workflow-point-detail');

		const chipEditor = detail.getChipEditorInput('labels');
		chipEditor.type('aaa\n');

		let fields = detail.getAutoCompleteFields().should('have.length.greaterThan', 10);
		detail.getChipEditorInput('labels').type('x');

		fields = detail.getAutoCompleteFields();
		detail.getAutoCompleteFields().should('have.length', 1);
	});

	it('should not be able to repeat existing labels', () => {
		detail.createWorkflowPoint();
		detail.openDetail('.stack-workflow-point', 'workflow-point-detail');

		const chipEditor = detail.getChipEditorInput('labels');
		chipEditor.type('aaa aaa ,\n\n');

		detail
			.getAllChips()
			.contains('aaa')
			.should('have.length', 1);
	});
});
