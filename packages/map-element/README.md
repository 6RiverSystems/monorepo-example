# map-element

Library that can be used to render 6rs maps.

## Render as Web Components

```typescript
// load the web component
import '@sixriver/map-element';
```

```html
<body>
	<div>
		<map-ui
			map-stack="..."
			show-aisle
			show-cost-area
			show-keep-out-area
			show-play-sound-area
			show-queue-area
			show-stay-on-path-area
			show-speed-limit-area
			show-weighted-area
			show-workflow-point
		></map-ui>
	</div>
</body>
```

## Render in a React application in JSX

```tsx
import { Map, Chuck, Goal, Path, scaleMin } from '@sixriver/map-element';

export function Component({ map, zoom }) {
	const x = 0;
	const y = 0;
	const orientation = 90;
	return (
		<Map map-stack={map} show-workflow-point show-aisle>
			<Chuck x={x} y={y} orientation={orientation} scaling-function={scaleMin} />
		</Map>
	);
}
```

## Running unit tests

Run `nx test map-element` to execute the unit tests.

## Running storybook

Run `npm run storybook map-element` to launch storybook.
