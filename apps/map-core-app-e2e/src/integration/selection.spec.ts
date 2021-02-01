import { AppPage } from '../support/app.po';

describe('map-core-app selection', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
		return page.start('selection');
	});

	it('should select multiple layers with box-select', () => {
		page.selectBounds({ x1: 100, y1: 100, x2: 600, y2: 400 });
		page.getSelectedLayers().should('have.length', 16);
	});

	it('should move multiple selected layers', () => {
		page.selectBounds({ x1: 100, y1: 100, x2: 600, y2: 400 });
		page.getSelectedLayers().should('have.length', 16);
		page.getSelectedLayers().then(selected => {
			const oldLocations = selected.toArray().map(el => el.getBoundingClientRect());

			page
				.getLayer('d4bc63a7-9273-4951-ad37-6f3a8d45541a')
				.then(layer => page.move(layer, -50, -50))
				.then(page.getSelectedLayers)
				.then(selectedAfter => {
					selectedAfter.toArray().forEach((item, idx) => {
						const location = item.getBoundingClientRect();
						expect(location.top).to.be.lessThan(oldLocations[idx].top);
						expect(location.right).to.be.lessThan(oldLocations[idx].right);
					});
				});
		});
	});

	it('should select layers with click', () => {
		page
			.getLayer('d4bc63a7-9273-4951-ad37-6f3a8d45541a')
			.click()
			.should('have.class', 'selected');

		page
			.getLayer('a322f8de-0cfa-4f86-b198-eab50073cbc3')
			.click()
			.should('have.class', 'selected');

		page.getLayer('d4bc63a7-9273-4951-ad37-6f3a8d45541a').should('not.have.class', 'selected');
	});
});
