import * as html from '@storybook/html';

import { initialize as baseInitialize } from './initialize';

/**
 * Initialize an HTML Storybook using a given `require.context`.
 *
 * @example
 * import { initialize } from '../../../tools/storybook/initialize-html';
 * initialize(require.context('../src', true, /\.stories\.tsx?$/));
 */
export const initialize = requireContext => {
	baseInitialize(html, requireContext);

	// Reload each time hot module replacement is triggered to ensure custom elements are re-registered
	if (module.hot) {
		module.hot.accept(requireContext.id, () => {
			const currentLocationHref = window.location.href;
			window.history.pushState(null, null, currentLocationHref);
			window.location.reload();
		});
	}
};
