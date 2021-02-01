import { Banner, FormLayout, Select, TextField } from '@shopify/polaris';
import React, { useContext } from 'react';
import { getTagHelpText } from '../../create-fields';
import { PointEditor } from '../geometry/point-editor';
import { InspectorHeader } from '../header/inspector-header';
import { NameEditor } from '../header/name-editor';
import { TagEditor } from '../tag/tag-editor';
import { workflowPointLabels } from './workflow-point-labels';
import { workflowPointOptions } from './workflow-point-options';
import { FormContext } from '../form-context';

/** Inspect workflow point information, displayed as a form */
export function WorkflowPointEditor() {
	const {
		fields: {
			orientation,
			target,
			labels,
			options,
			clearLabels,
			clearOptions,
			mixedLabels,
			mixedOptions,
		},
		multi,
	} = useContext(FormContext);

	const workflowPointTypes = [
		{ label: 'meeting point', value: 'meetingPoint' },
		{ label: 'induct', value: 'induct' },
		{
			label: 'user directed induct',
			value: 'userDirectedInduct',
		},
		{ label: 'takeoff', value: 'takeoff' },
		{
			label: 'destination takeoff',
			value: 'takeoffDestination',
		},
		{ label: 'exception takeoff', value: 'takeoffException' },
		{ label: 'post charge', value: 'postCharge' },
		{ label: 'pre charge', value: 'preCharge' },
		{ label: 'replen induct', value: 'replenInduct' },
		{ label: 'replen meeting point', value: 'replenMeetingPoint' },
		{ label: 'replen takeoff', value: 'replenTakeoff' },
		{ label: 'post pick', value: 'postPick' },
		{ label: 'generic', value: 'generic' },
	];

	return (
		<FormLayout>
			<InspectorHeader />
			<NameEditor />
			<TextField type="number" label="Orientation (degrees)" {...orientation} />
			<Select label="Type" options={workflowPointTypes} {...target} />
			<TagEditor
				field={labels}
				clearField={clearLabels}
				selectedTags={labels.value}
				title="Labels"
				suggestedTags={workflowPointLabels(target.value)}
				helpText={getTagHelpText(mixedLabels)}
				multi={multi}
				errorMessage={null}
			/>
			<TagEditor
				field={options}
				clearField={clearOptions}
				selectedTags={options.value}
				title="Options (order matters)"
				suggestedTags={workflowPointOptions(target.value)}
				helpText={getTagHelpText(mixedOptions)}
				multi={multi}
				errorMessage={null}
			/>
			<PointEditor />
		</FormLayout>
	);
}
