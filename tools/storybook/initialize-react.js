import * as react from '@storybook/react';

import { initialize as baseInitialize } from './initialize';

/**
 * Initialize a React Storybook using a given `require.context`.
 *
 * @example
 * import { initialize } from '../../../tools/storybook/initialize-react';
 * initialize(require.context('../src', true, /\.stories\.tsx?$/));
 */
export const initialize = requireContext => baseInitialize(react, requireContext);
