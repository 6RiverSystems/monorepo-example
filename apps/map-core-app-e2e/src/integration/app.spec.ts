import { AppPage } from '../support/app.po';

describe('map-core-app test Zoom', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
		page.start();
	});

	it('should Zoom in when clicking on the zoom-in button', () => {
		page.getZoom().then(zoom => {
			const originalZoom = zoom;
			page
				.getZoomInButton()
				.click()
				.then(page.getZoom)
				.then(nextZoom => {
					expect(nextZoom).to.be.greaterThan(originalZoom);
				});
		});
	});

	it('should Zoom out when clicking on the zoom-out button', () => {
		page
			.getZoomInButton()
			.click()
			.click();
		page.getZoom().then(zoom => {
			const originalZoom = zoom;
			page
				.getZoomOutButton()
				.click()
				.then(page.getZoom)
				.then(nextZoom => {
					expect(nextZoom).to.be.lessThan(originalZoom);
				});
		});
	});

	it('should fit to view after clicking on the fit to view button', () => {
		page.getZoom().then(zoom => {
			const originalZoom = zoom;
			page
				.getZoomInButton()
				.click()
				.click()
				.click()
				.then(page.getFitToViewButton)
				.click()
				.then(page.getZoom)
				.then(zoomAfter => {
					expect(zoomAfter).to.equal(originalZoom);
				});
		});
	});

	it('should fit to view after pressing space bar', () => {
		page.getZoom().then(zoom => {
			const originalZoom = zoom;
			page
				.getZoomInButton()
				.click()
				.click()
				.click()
				.then(page.sendSpaceBar)
				.then(page.getZoom)
				.then(zoomAfter => {
					expect(zoomAfter).to.equal(originalZoom);
				});
		});
	});
});

describe('map-core-app tools', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
		return page.start();
	});

	it('should create a new WorkflowPoint when clicking on the control', () => {
		page
			.getEditControlButton('workflowpoint')
			.click()
			.then(page.getSiteMapElement)
			.click()
			.get('.stack-workflow-point')
			.should('have.length', 1);
	});
});
