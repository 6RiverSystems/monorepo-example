import { PanController } from '@sixriver/map-controller';
import { useContext, useEffect } from 'react';

import { ControllerContext } from './controller-context';
import { ControlProps } from './use-controller';

export function PanControl(props: ControlProps) {
	const { stack, zoomService } = useContext(ControllerContext);

	useEffect(() => {
		stack.addController(new PanController(zoomService));
	}, [stack]);

	return null;
}
