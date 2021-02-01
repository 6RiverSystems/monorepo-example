import { ZoomController } from '@sixriver/map-controller';
import { useContext, useEffect } from 'react';

import { ControllerContext } from './controller-context';
import { ControlProps } from './use-controller';

export function ZoomControl(props: ControlProps) {
	const { stack, zoomService } = useContext(ControllerContext);

	useEffect(() => {
		stack.addController(new ZoomController(zoomService));
	}, [stack]);

	return null;
}
