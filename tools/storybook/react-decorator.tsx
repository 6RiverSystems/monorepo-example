/* eslint-disable react-hooks/rules-of-hooks */

import ReactDOM from 'react-dom';
import { makeDecorator } from '@storybook/addons';
import { useEffect, useMemo } from '@storybook/client-api';

/**
 * Storybook decorator that renders React stories into HTML. Makes it possible to add React stories to an
 * HTML Storybook instance.
 *
 * @see From {@link https://github.com/JetBrains/ring-ui/blob/1e4a26206752b3827a3/.storybook/react-decorator.js}.
 *
 * @example
 * import reactDecorator from '../../../tools/storybook/react-decorator';
 *
 * export default {
 * 	title: 'My Story',
 * 	decorators: [reactDecorator()],
 * };
 */
export const reactDecorator = makeDecorator({
	name: 'reactDecorator',
	parameterName: '',
	wrapper: (getStory, context) => {
		const el = useMemo(() => document.createElement('span'), []);

		useEffect(
			() =>
				function cleanup() {
					ReactDOM.unmountComponentAtNode(el);
				},
			[el],
		);

		ReactDOM.render(getStory(context), el);

		return el;
	},
});
