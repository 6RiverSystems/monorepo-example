import { createContext } from 'react';
import { ControllerStack, SelectionService, ZoomService } from '@sixriver/map-controller';

interface ControllerContextContents {
	stack: ControllerStack;
	selectionService: SelectionService;
	zoomService: ZoomService;
}

export const ControllerContext = createContext<ControllerContextContents>({
	stack: null,
	selectionService: null,
	zoomService: null,
});
