import { SelectionController } from '@sixriver/map-controller';
import { useContext, useEffect } from 'react';

import { ControllerContext } from './controller-context';
import { ControlProps } from './use-controller';

export function SelectionControl(props: ControlProps) {
	const { stack, selectionService } = useContext(ControllerContext);

	useEffect(() => {
		stack.addController(new SelectionController(selectionService));
	}, [stack]);

	return null;
}
