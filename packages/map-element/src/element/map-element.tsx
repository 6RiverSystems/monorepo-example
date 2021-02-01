import { ReactHTMLElement } from '@sixriver/react-html-element';
import { camelCase } from 'lodash-es';

import { App, Props } from './app';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'map-ui': {
				'map-stack': object | string;
				'show-aisle': boolean;
				'show-cost-area': boolean;
				'show-keep-out-area': boolean;
				'show-play-sound-area': boolean;
				'show-queue-area': boolean;
				'show-stay-on-path-area': boolean;
				'show-speed-limit-area': boolean;
				'show-weighted-area': boolean;
				'show-workflow-point': boolean;
			};
		}
	}
}

export class MapElement extends ReactHTMLElement<Props> {
	constructor() {
		super(App);
	}

	static get observedAttributes() {
		return [
			'map-stack',
			'show-aisle',
			'show-cost-area',
			'show-keep-out-area',
			'show-play-sound-area',
			'show-queue-area',
			'show-stay-on-path-area',
			'show-speed-limit-area',
			'show-weighted-area',
			'show-workflow-point',
		];
	}

	get 'map-stack'(): object | null {
		const attrib = this.getAttribute('map-stack');
		if (attrib !== null) {
			return JSON.parse(attrib);
		}
		return null;
	}

	set 'map-stack'(val: object | null) {
		this.setAttribute('map-stack', JSON.stringify(val));
	}

	get 'show-aisle'(): boolean {
		const attrib = this.getAttribute('show-aisle');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-aisle'(val: boolean) {
		this.setAttribute('show-aisle', Boolean(val).toString());
	}

	get 'show-cost-area'(): boolean {
		const attrib = this.getAttribute('show-cost-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-cost-area'(val: boolean) {
		this.setAttribute('show-cost-area', Boolean(val).toString());
	}

	get 'show-keep-out-area'(): boolean {
		const attrib = this.getAttribute('show-keep-out-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-keep-out-area'(val: boolean) {
		this.setAttribute('show-keep-out-area', Boolean(val).toString());
	}

	get 'show-play-sound-area'(): boolean {
		const attrib = this.getAttribute('show-play-sound-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-play-sound-area'(val: boolean) {
		this.setAttribute('show-play-sound-area', Boolean(val).toString());
	}

	get 'show-queue-area'(): boolean {
		const attrib = this.getAttribute('show-queue-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-queue-area'(val: boolean) {
		this.setAttribute('show-queue-area', Boolean(val).toString());
	}

	get 'show-stay-on-path-area'(): boolean {
		const attrib = this.getAttribute('show-stay-on-path-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-stay-on-path-area'(val: boolean) {
		this.setAttribute('show-stay-on-path-area', Boolean(val).toString());
	}

	get 'show-speed-limit-area'(): boolean {
		const attrib = this.getAttribute('show-speed-limit-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-speed-limit-area'(val: boolean) {
		this.setAttribute('show-speed-limit-area', Boolean(val).toString());
	}

	get 'show-weighted-area'(): boolean {
		const attrib = this.getAttribute('show-weighted-area');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-weighted-area'(val: boolean) {
		this.setAttribute('show-weighted-area', Boolean(val).toString());
	}

	get 'show-workflow-point'(): boolean {
		const attrib = this.getAttribute('show-workflow-point');
		if (attrib !== null) {
			return true;
		}
		return false;
	}

	set 'show-workflow-point'(val: boolean) {
		this.setAttribute('show-workflow-point', Boolean(val).toString());
	}

	protected render(): void {
		MapElement.observedAttributes.forEach(attrib => (this.props[camelCase(attrib)] = this[attrib]));
		super.render();
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	attributeChangedCallback(): void {
		this.render();
	}
}

if (window.customElements.get('map-ui') === undefined) {
	window.customElements.define('map-ui', MapElement);
}

declare global {
	interface HTMLElementTagNameMap {
		'map-ui': MapElement;
	}
}
