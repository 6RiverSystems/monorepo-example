import { initialize } from '../../../tools/storybook/initialize-html';

initialize(require.context('../src', true, /\.stories\.tsx?$/));
