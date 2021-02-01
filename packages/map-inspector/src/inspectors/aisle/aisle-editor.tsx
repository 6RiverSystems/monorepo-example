import { Button, FormLayout, RadioButton, Stack } from '@shopify/polaris';
import React, { useCallback, useContext, useState } from 'react';
import { getTagHelpText } from '../../create-fields';
import { FormContext } from '../form-context';
import { LineEditor } from '../geometry/line-editor';
import { InspectorHeader } from '../header/inspector-header';
import { NameEditor } from '../header/name-editor';
import { TagEditor } from '../tag/tag-editor';


/**
 * Inspect aisle information, displayed as a form
 */
export function AisleEditor() {
	const {
		fields: {
			directed,
			labels,
			headX,
			headY,
			tailX,
			tailY,
			clearLabels,
			mixedLabels,
			swapDirection,
			zoneLabels,
		},
		multi,
	} = useContext(FormContext);

	let initialDirection;
	switch (directed.value) {
		case true:
			initialDirection = 'oneway';
			break;
		case false:
			initialDirection = 'twoway';
			break;
		default:
			initialDirection = 'mixed';
	}

	const [value, setValue] = useState(initialDirection);
	const handleAisleDirection = useCallback(
		(_checked, newValue) => {
			switch (newValue) {
				case 'oneway':
					directed.onChange(true);
					break;
				case 'twoway':
					directed.onChange(false);
					break;
				default:
					directed.onChange('mixed');
			}
			setValue(newValue);
		},
		[directed, value],
	);

	const handleSwapDirection = useCallback(() => {
		swapLineCoordinates();
		swapDirection.onChange(!swapDirection.value);
	}, [headY]);

	return (
		<FormLayout>
			<InspectorHeader />
			<NameEditor />
			<TagEditor
				field={labels}
				clearField={clearLabels}
				selectedTags={labels.value}
				title="Zone"
				suggestedTags={zoneLabels.value.map(label => ({ value: label, label }))}
				helpText={getTagHelpText(mixedLabels)}
				errorMessage={null}
				multi={multi}
			/>
			<Stack vertical>
				<RadioButton
					label="One Way Aisle"
					checked={value === 'oneway'}
					id="oneway"
					name="direction"
					onChange={handleAisleDirection}
				/>
				<RadioButton
					label="Two Way Aisle"
					id="twoway"
					name="direction"
					checked={value === 'twoway'}
					onChange={handleAisleDirection}
				/>
				{multi && initialDirection === 'mixed' ? (
					<RadioButton
						label="One Way/ Two Way Aisles"
						id="mixed"
						name="direction"
						checked={value === 'mixed'}
						onChange={handleAisleDirection}
						disabled
					/>
				) : null}
			</Stack>
			<Button size="slim" onClick={handleSwapDirection}>
				Swap Direction
			</Button>
			<LineEditor />
		</FormLayout>
	);

	function swapLineCoordinates() {
		const tempTailX = headX.value;
		const tempTailY = headY.value;
		const tempHeadX = tailX.value;
		const tempHeadY = tailY.value;

		tailX.onChange(tempTailX);
		tailY.onChange(tempTailY);
		headX.onChange(tempHeadX);
		headY.onChange(tempHeadY);
	}
}
