/** Utility functions for use in Storybook stories. */

import * as actions from '@storybook/addon-actions';

/**
 * Render an element, first removing it from the DOM if it already exists.
 * @param selector - An element selector.
 * @returns An element.
 */
export const renderEl = (selector: keyof HTMLElementTagNameMap): Element => {
	const el = document.querySelector(selector);
	if (el !== null) {
		el.remove();
	}

	return document.createElement(selector);
};

/**
 * Render an element if it does not already exist in the DOM.
 * @param selector - An element selector.
 * @returns An element.
 */
export const renderElOnce = (selector: keyof HTMLElementTagNameMap): Element => {
	const el = document.querySelector(selector);
	return el || document.createElement(selector);
};

/**
 * Change an element display to "block" and set its width and height to 100%.
 * @param el - An element.
 * @returns The element.
 */
export const fillParent = (el: HTMLElement): HTMLElement => {
	el.style.width = '100%';
	el.style.height = '100%';
	el.style.display = 'block';
	return el;
};

/**
 * Increase the size of an element by a factor.
 * @param el - An element.
 * @param width - New width for the element in pixels.
 * @param [height] New height for the element in pixels. If not provided, width will be used as height.
 * @returns The element.
 */
export const increaseSize = (el: HTMLElement, width: number, height?: number): HTMLElement => {
	el.style.width = `${width}px`;
	el.style.height = `${height || width}px`;
	return el;
};

/** Extract the `detail` property of a `CustomEvent` for display. */
const customEventActionDecorator = actions.decorate([
	args => {
		return [args[0].detail];
	},
]);

/**
 * Workaround for Storybook's actions addon not displaying CustomEvent `detail` property.
 * @see {@link https://github.com/storybookjs/storybook/issues/8544}
 */
export const withCustomEventActions = <T extends HTMLElement>(eventNames: string[], el: T): T => {
	for (const eventName of eventNames) {
		el.addEventListener(eventName, customEventActionDecorator.action(eventName));
	}

	return el;
};
