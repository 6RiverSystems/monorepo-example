import { assert } from 'chai';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { ImpassableAreaState } from '@sixriver/map-io';
import { MapInspectorProps, MapInspector } from './map-inspector';
import { renderWithAppProvider } from './inspectors/render-app-provider';

const impassableAreaFeature: ImpassableAreaState = {
	properties: { name: 'msborder', type: 'impassable', id: '0009cfa9-0df5-44a7-9dd0-531581e73426' },
	bounds: [
		[111, 222],
		[223, 333],
	],
};

describe('Form Submit', () => {
	it('should render an inspector successfully', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		assert.doesNotThrow(() =>
			renderWithAppProvider(
				<MapInspector features={[impassableAreaFeature]} callback={callback} />,
			),
		);
	});

	it('should call the callback to update feature information', () => {
		let callbackResult = [];
		const callback: MapInspectorProps['callback'] = features => {
			callbackResult = features;
		};
		const { getByLabelText, getByDisplayValue, getByRole } = renderWithAppProvider(
			<MapInspector features={[impassableAreaFeature]} callback={callback} />,
		);

		fireEvent.change(getByLabelText('Name'), { target: { value: 'newName' } });
		getByDisplayValue('newName');

		fireEvent.click(getByRole('button'));
		assert.equal(callbackResult[0].properties.name, 'newName');
	});
});
