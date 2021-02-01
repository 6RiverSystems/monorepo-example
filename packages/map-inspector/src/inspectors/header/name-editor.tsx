import React, { useContext } from 'react';
import { TextField } from '@shopify/polaris';

import { FormContext } from '../form-context';

/**
 * Inspect name information, displayed on every form
 */
export function NameEditor() {
	const {
		fields: { name, type },
		multi,
	} = useContext(FormContext);

	const disabled =
		multi &&
		(type.value === 'aisle' ||
			type.value === 'stayOnPath' ||
			type.value === 'queue' ||
			type.value === 'workflowPoint');
	return <TextField label="Name" {...name} disabled={disabled} />;
}
