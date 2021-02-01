import { withKnobs } from '@storybook/addon-knobs';

/**
 * Initialize Storybook using a given `require.context` and "preview" (`@storybook/html`, `@storybook/react`, etc.).
 *
 * @example
 * import * as html from '@storybook/html';
 * import { initialize } from '../../../tools/storybook/initialize';
 * initialize(html, require.context('../src', true, /\.stories\.tsx?$/));
 */
export const initialize = ({ configure, addDecorator, addParameters }, requireContext) => {
	// TODO when upgrading to Storybook 6, remove these and rely on add-on presets instead
	addDecorator(withKnobs);

	addParameters({
		options: {
			storySort: {
				method: 'alphabetical',
			},
		},
	});

	configure(requireContext, module);
};
