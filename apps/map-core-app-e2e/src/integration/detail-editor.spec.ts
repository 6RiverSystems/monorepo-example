import { DetailPage } from '../support/feature-detail.po';

describe('map-core-app test detail', () => {
	let detail: DetailPage;

	beforeEach(() => {
		detail = new DetailPage();
		return detail.start();
	});

	it('should not be able to submit form with empty name', () => {
		function checkNameInput() {
			cy.get(`button[type=submit]`).should('have.attr', 'disabled', 'disabled');
			cy.get(`input[formcontrolname=name]`).should('have', 'name', '');

			cy.get(`input[formcontrolname=name]`).type('mytestname');
			cy.get(`input[formcontrolname=name]`).should('have', 'name', 'mytestname');

			cy.get(`button[type=submit]`).should('not.have.attr', 'disabled', 'disabled');
		}

		detail.createWorkflowPoint();
		detail.openDetail('.stack-workflow-point', 'workflow-point-detail');

		checkNameInput();

		detail.createQueueArea({ x1: 80, y1: 80, x2: 120, y2: 120 });
		detail.getLayers('stack-queue').should('have.length', 1); // Could not find 'stack-queue'
		detail.openDetail('.stack-queue', 'queue-area-detail');

		checkNameInput();

		detail.createStayOnPathArea({ x1: 160, y1: 160, x2: 200, y2: 200 });
		detail.getLayers('stack-stayonpath').should('have.length', 1); // Could not find 'stack-stayonpath'
		detail.openDetail('.stack-stayonpath', 'stay-on-path-area-detail');

		checkNameInput();

		detail.createAisle({ x1: 290, y1: 280, x2: 330, y2: 330 });
		detail.getLayers('stack-aisle').should('have.length', 1); // Could not find 'stack-aisle'
		detail.openDetail('.stack-aisle', 'aisle-detail');

		checkNameInput();
	});
});
