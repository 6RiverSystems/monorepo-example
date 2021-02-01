import React from 'react';
import { StyleCacheProvider } from '@sixriver/react-html-element';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';

import { MapInspector, Feature } from '../map-inspector';

export type Props = { styleRoot: HTMLElement; features?: Feature[] };

export const App = function(this: HTMLElement, state: Props) {
	const key = state.features.reduce((key, feature) => key + feature.properties.id, '');
	return (
		<StyleCacheProvider styleRoot={state.styleRoot}>
			<link href="styles.min.css" rel="stylesheet" type="text/css" />
			<AppProvider i18n={en}>
				<MapInspector {...state} key={key} />
			</AppProvider>
		</StyleCacheProvider>
	);
};
