import React from 'react';
import { render } from '@testing-library/react';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';

export function renderWithAppProvider(element: JSX.Element) {
	return render(<AppProvider i18n={en}>{element}</AppProvider>);
}
