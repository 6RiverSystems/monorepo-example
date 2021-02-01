/**
 * Shared Storybook preset. To use, add the module to the `presets` array in `.storybook/main.js`.
 *
 * @example
 * const { resolve } = require('path');
 *
 * module.exports = {
 *	presets: [resolve(__dirname, '../../../tools/storybook/preset')],
 * };
 */

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	/** Modules to run inside the preview. */
	entries: entry => {
		return [...entry, require.resolve('./preview-head')];
	},
	/** Addons that should be enabled in every Storybook instance. */
	addons: ['@storybook/addon-knobs', '@storybook/addon-actions'],
	/** Customize Webpack configuration. */
	webpack: config => {
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			use: [
				{
					loader: require.resolve('ts-loader'),
					options: {
						reportFiles: ['./**/*.stories.{ts,tsx}'],
					},
				},
			],
		});
		config.resolve.extensions.push('.ts', '.tsx');
		config.resolve.plugins = [...(config.resolve.plugins || []), new TsconfigPathsPlugin()];
		config.performance.hints = false;
		return config;
	},
};
