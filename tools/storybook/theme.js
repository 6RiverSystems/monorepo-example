/**
 * Shared Storybook theme. To use, add the line below into `.storybook/manager.js`.
 * @example
 * import '../../../tools/storybook/theme';
 */

import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
	base: 'dark',
	brandImage: 'https://6river.com/wp-content/uploads/2019/05/6rs_white_logo.png',
});

addons.setConfig({
	theme,
});
