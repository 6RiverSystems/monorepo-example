import { ReactHTMLElement } from '@sixriver/react-html-element';

import { App, Props } from './app';
import { Feature } from '../map-inspector';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'map-inspector': {
				features: Feature[] | string;
			};
		}
	}
}

export interface SubmitEvent {
	type: 'submit';
	features: Feature[];
}

export class MapInspectorElement extends ReactHTMLElement<Props> {
	private _features: string = '[]';
	constructor() {
		super(App);
	}

	// TODO: should be static, but AOT compiler is not happy with it.
	get observedAttributes() {
		return ['features'];
	}

	get features(): Feature[] | null {
		return this._features ? JSON.parse(this._features) : [];
	}

	set features(val: Feature[] | null) {
		// we don't reflect the features back to the element's attribute because it's huge.
		this._features = JSON.stringify(val);
		this.render();
	}

	private dispatchSubmitEvent(features: Feature[]) {
		this.dispatchEvent(
			new CustomEvent<SubmitEvent>('inspector-event', {
				bubbles: true,
				cancelable: false,
				composed: true,
				detail: {
					type: 'submit',
					features,
				},
			}),
		);
	}

	protected render(): void {
		this.observedAttributes.forEach(attrib => (this.props[attrib] = this[attrib]));
		// we don't reflect the features back to the element's attribute because it's huge.
		this.props['features'] = this._features ? JSON.parse(this._features) : [];
		this.props['callback'] = this.dispatchSubmitEvent.bind(this);
		super.render();
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	attributeChangedCallback(): void {
		this.render();
	}
}

if (window.customElements.get('map-inspector') === undefined) {
	window.customElements.define('map-inspector', MapInspectorElement);
}

declare global {
	interface HTMLElementTagNameMap {
		'map-inspector': MapInspectorElement;
	}
}
