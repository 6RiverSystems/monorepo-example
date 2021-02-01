export class AppPage {
	start(mapName = 'empty') {
		return this.navigateTo(mapName)
			.then(this.turnOffAnimation)
			.get('figure.leaflet-container')
			.click('topLeft');
	}

	navigateTo(mapName: string) {
		return cy
			.visit(`/?mapName=${mapName}&test=true`)
			.get('.editor.leaflet-container .leaflet-overlay-pane img', {
				timeout: 10000,
			}); // Site Map Element is taking too long to appear in the DOM
	}

	turnOffAnimation() {
		return cy.window().then(function(win: any) {
			return (win.ng.probe(
				win.document.querySelector('.editor.leaflet-container'),
			).componentInstance.map.options.zoomAnimationThreshold = 0);
		});
	}

	getZoom() {
		return cy.window().then(function(win: any): number {
			const zoom = win.ng
				.probe(win.document.querySelector('.editor.leaflet-container'))
				.componentInstance.map.getZoom();
			return zoom;
		});
	}

	createWorkflowPoint() {
		const control = this.getEditControlButton('workflowpoint');
		control.click();

		return this.getSiteMapElement().click();
	}

	createQueueArea(bounds) {
		return this.createArea('Queuearea', bounds);
	}

	createStayOnPathArea(bounds) {
		return this.createArea('StayOnPatharea', bounds);
	}

	private createArea(controlName: string, { x1 = 100, y1 = 100, x2 = 150, y2 = 200 }) {
		this.getSiteMapElement().click();
		this.getEditControlButton(controlName)
			.click()
			.wait(100);

		const siteMap = this.getSiteMapElement()
			.trigger('mousemove', x1 - 1, y1 - 1)
			.trigger('mousedown', x1, y1, { which: 1 });

		let x = x1;
		let y = y1;
		for (; x <= x2; x += (x2 - x1) / 10) {
			siteMap.trigger('mousemove', x, y, { which: 1 });
		}
		for (; y <= y2; y += (y2 - y1) / 10) {
			siteMap.trigger('mousemove', x, y, { which: 1 });
		}

		siteMap
			.trigger('mousemove', x2, y2, { which: 1 })
			.trigger('mouseup', x2, y2, { which: 1 })
			.wait(100)
			.click('topLeft');

		return siteMap;
	}

	createAisle({ x1 = 100, y1 = 100, x2 = 150, y2 = 200 }) {
		this.getSiteMapElement().click();
		this.getEditControlButton('aisle')
			.click()
			.wait(100);

		const siteMap = this.getSiteMapElement()
			.trigger('mousedown', x1, y1, { which: 1 })
			.trigger('mouseup', x1, y1, { which: 1 });

		let x = x1;
		let y = y1;
		for (; x <= x2; x += (x2 - x1) / 10) {
			siteMap.trigger('mousemove', x, y);
		}
		for (; y <= y2; y += (y2 - y1) / 10) {
			siteMap.trigger('mousemove', x, y);
		}

		siteMap
			.trigger('mousedown', x2, y2, { which: 1 })
			.trigger('mouseup', x2, y2, { which: 1 })
			.wait(100)
			.click('topLeft');

		return siteMap;
	}

	getZoomInButton() {
		return cy.get('.leaflet-control-zoom-in');
	}

	getZoomOutButton() {
		return cy.get('.leaflet-control-zoom-out');
	}

	getFitToViewButton() {
		return cy.get('.leaflet-control-zoom-home');
	}

	sendSpaceBar() {
		return cy.get('.leaflet-container').type(' ');
	}

	getEditControlButton(tag: string) {
		return cy.get(`a[data-tag=${tag}]`);
	}

	getSiteMapElement() {
		return cy.get('figure.leaflet-container');
	}

	getLayers(tag: string) {
		return cy.get(`figure .leaflet-pane .${tag}`);
	}

	getLayer(id: string) {
		return cy.get(`[data-tag='${id}']`);
	}

	getSelectedLayers() {
		return cy.get('figure .leaflet-pane .selected');
	}

	selectBounds({ x1 = 100, y1 = 100, x2 = 150, y2 = 200 }) {
		return this.getSiteMapElement()
			.click('topLeft')
			.trigger('mousedown', x1, y1, { which: 1, shiftKey: true })
			.trigger('mousemove', x2, y2, { which: 1, shiftKey: true })
			.trigger('mouseup', x2, y2, { which: 1, shiftKey: true });
	}

	move(element, x: number, y: number) {
		return cy
			.get(element)
			.trigger('mousedown', 0, 0, { which: 1 })
			.trigger('mousemove', x, y, { which: 1, force: true })
			.trigger('mouseup', x, y, { which: 1, force: true });
	}
}
