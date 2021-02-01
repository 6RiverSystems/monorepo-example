export enum EventTypes {
	Click = 'Click',
	DblClick = 'DblClick',
	MouseDown = 'MouseDown',
	MouseUp = 'MouseUp',
	MouseOver = 'MouseOver',
	MouseOut = 'MouseOut',
	MouseMove = 'MouseMove',
	Wheel = 'Wheel',
	ContextMenu = 'ContextMenu',
	KeyPress = 'KeyPress',
}

export abstract class EventHandler {
	handleEvent(type: EventTypes, event: Event): boolean {
		return this[`handle${type}`](event);
	}
	handleClick(event: MouseEvent): boolean {
		return false;
	}
	handleDblClick(event: MouseEvent): boolean {
		return false;
	}
	handleMouseDown(event: MouseEvent): boolean {
		return false;
	}
	handleMouseUp(event: MouseEvent): boolean {
		return false;
	}
	handleMouseOver(event: MouseEvent): boolean {
		return false;
	}
	handleMouseOut(event: MouseEvent): boolean {
		return false;
	}
	handleMouseMove(event: MouseEvent): boolean {
		return false;
	}
	handleWheel(event: WheelEvent): boolean {
		return false;
	}
	handleContextMenu(event: MouseEvent): boolean {
		return false;
	}
	handleKeyPress(event: KeyboardEvent): boolean {
		return false;
	}
}
