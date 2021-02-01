import { isDevMode } from '@angular/core';
import { DomUtil } from 'leaflet';

export class ClassNameUpdater {
	constructor(
		private elementGetter: () => HTMLElement,
		private id: string,
		private _classes: string[] = [],
	) {}

	get element(): HTMLElement {
		return this.elementGetter();
	}

	/**
	 * Sets an array of classes on the layer
	 * @param classes space separated style classes to replace the existing style classes
	 */
	set classes(classes: string[]) {
		if (this.element) {
			this._classes.forEach(cn => DomUtil.removeClass(this.element, cn));
			classes.forEach(cn => DomUtil.addClass(this.element, cn));
			if (isDevMode()) {
				this.element.setAttribute('data-tag', this.id);
			}
		}
		this._classes = classes;
	}

	get classes(): string[] {
		return this._classes;
	}

	addClass(styleClass: string): void {
		styleClass = styleClass.trim();
		if (this._classes.indexOf(styleClass) === -1) {
			if (this.element) {
				DomUtil.addClass(this.element, styleClass);
			}
			this._classes.push(styleClass);
		}
	}

	removeClass(styleClass: string): void {
		styleClass = styleClass.trim();
		const idx = this._classes.indexOf(styleClass);
		if (idx !== -1) {
			if (this.element) {
				DomUtil.removeClass(this.element, styleClass);
			}
			this._classes.splice(idx, 1);
		}
	}

	syncClasses(): void {
		this.classes = this._classes;
	}
}
