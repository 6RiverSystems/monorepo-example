import React from 'react';
import { StyleCacheProvider } from '@sixriver/react-html-element';

import { Map, MapProps } from '../map';

export type Props = MapProps & { styleRoot: HTMLElement };

export const App = function(this: HTMLElement, state: Props) {
	return (
		<StyleCacheProvider styleRoot={state.styleRoot}>
			<Map {...state} />
		</StyleCacheProvider>
	);
};
