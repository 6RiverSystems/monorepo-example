## Map Core

[![codecov](https://codecov.io/gh/6RiverSystems/map-core/branch/develop/graph/badge.svg?token=fdrSG9nIXo)](https://codecov.io/gh/6RiverSystems/map-core)
[![CircleCI](https://circleci.com/gh/6RiverSystems/map-core.svg?style=svg&circle-token=fa45928568a131a9041d43aba380657f1c9d7e5b)](https://circleci.com/gh/6RiverSystems/map-core)

An Angular library for editing and displaying 6 River Systems map files.

The Map Component can be customized using display options. Some factory display options are provided:

- liveViewOptions, for viewing MFPs on a simplified version of the map
- editorOptions, for editing the map and not viewing MFPs
- powerUserOptions, for viewing MFPs on a map with all details visible

```html
<!-- options must be defined in the component -->
<map-core></map-core>
```

MapLayerOptionConfig gives finer control over layer behaviors such as selection, showing a detail view
and the ability to move a layer.

```javascript
export const editableLayer: MapLayerOptionConfig = {
	selectable: true,
	inspectable: true,
	editable: true,
	movable: true,
};

export const editorOptions = new Map<DisplayOptions, Value>([
	[DisplayOptions.OccupancyGrid, true],
	[DisplayOptions.EditPalette, true],
	[DisplayOptions.MfpDisplay, false],
	[DisplayOptions.Aisle, editableLayer],
	[DisplayOptions.WorkflowPoint, editableLayer],
	[DisplayOptions.KeepOutArea, editableLayer],
	[DisplayOptions.CostArea, editableLayer],
	[DisplayOptions.QueueArea, editableLayer],
	[DisplayOptions.StayOnPathArea, editableLayer],
	[DisplayOptions.SpeedLimitArea, editableLayer],
	[DisplayOptions.WeightedArea, editableLayer],
	[DisplayOptions.ImpassableArea, editableLayer],
	[DisplayOptions.Position, true],
]);
```

## Installation

- `npm install @sixriver/map-core`
- in `styles.scss`:

```scss
@import '~@sixriver/map-core/styles.scss';
```

- in `polyfills.ts`:

```TypeScript
// Make Socket.io client work (https://github.com/socketio/socket.io-client/issues/1166)
(window as any).global = window;

import 'leaflet';
import 'leaflet-editable';
```

- in `environments/environment/ts`:

```TypeScript
import {NgxLoggerLevel} from 'ngx-logger';
import {MapCoreConfig} from '@sixriver/map-core';

export const environment = {
	production:  false,
	mapCoreConfig: <MapCoreConfig> {
		logLevel: NgxLoggerLevel.INFO,
		socket: {
			baseUrl: 'http://localhost:3003/',
			config: {},
		},
		storagePath: 'http://localhost:3003/',
		assetManagerBaseUrl: 'http://localhost:3002/',
		taskCoordinatorBaseUrl: 'http://localhost:3001/',
		historicalView: false,
		googleClientId: '',
	},
};
```

- in `app.module.ts`:

```TypeScript
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {LoggerModule, NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {
	mapCoreReducers,
	mapCoreMetaReducers,
	MapCoreModule,
	MapStorageManagerService,
	MapStorageService,
	MAP_CORE_CONFIG,
} from '@sixriver/map-core';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {AppEffectsModule} from './app-effects.module';

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  imports: [
		AppEffectsModule,
		LoggerModule.forRoot({level: environment.mapCoreConfig.logLevel, serverLogLevel: NgxLoggerLevel.OFF}),
		MapCoreModule,
		StoreModule.forRoot(mapCoreReducers, {metaReducers: mapCoreMetaReducers}),
	],
	providers: [
		{provide: MAP_CORE_CONFIG, useValue: new BehaviorSubject(environment.mapCoreConfig)},
		{provide: MapStorageService, useClass: MapStorageManagerService},
		NGXLogger,
	],
})
export class AppModule {}
```

## Usage

```TypeScript
import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {
	MapMode,
	MapCoreState,
	DisplayOptions,
	Value,
	MfpsListen,
	MfpsListenWork,
	FetchMapStack,
	UsersListen,
} from '@sixriver/map-core';

Component({
	selector: 'app-floor-view',
	templateUrl: './floor-view.component.html',
	styleUrls: ['./floor-view.component.scss']
	})
export class FloorViewComponent implements OnInit {
	mode = MapMode.LiveView;
	options = new Map<DisplayOptions, Value>([
		[DisplayOptions.ImpassableArea, true]
	]);

	constructor(
		private store: Store<MapCoreState>,
	) {}

	ngOnInit() {
		this.store.dispatch(new MfpsListen());
		this.store.dispatch(new MfpsListenWork());
		this.store.dispatch(new UsersListen());
			// Using map.6rms assumes that MapStorageManagerService is being used
		this.store.dispatch(new FetchMapStack({fileName: 'map.6rms', generation: null}));
	}
}
```

## Development

- `npm start` to build the library and test app, do an incremental rebuild when files change
- `npm run build` to build the library for production
- `npm test` to run unit tests and re-run on changes
- `npm run test:single` to run unit tests once
- `npm run lint` to lint the code

## The Hack Way

Every time you make a change in the library, run the following commands (strung together for simplicity):

```shell
export CURR_PROJECT=[name of a project] && \
rm -rf ../$CURR_PROJECT/node_modules/@sixriver/map-core/* && \
rm -rf ../$CURR_PROJECT/node_modules/@sixriver/map-io/* && \
rm -rf ../$CURR_PROJECT/node_modules/@sixriver/map-validator/* && \
rm -rf ../$CURR_PROJECT/node_modules/@sixriver/map-controller/* && \
rm -rf ../$CURR_PROJECT/node_modules/@sixriver/map-element/* && \
npm run build && \
cp -r dist/libs/map-core ../$CURR_PROJECT/node_modules/@sixriver/ && \
cp -r dist/libs/map-io ../$CURR_PROJECT/node_modules/@sixriver/ && \
cp -r dist/libs/map-validator ../$CURR_PROJECT/node_modules/@sixriver/ && \
cp -r dist/libs/map-controller ../$CURR_PROJECT/node_modules/@sixriver/ && \
cp -r dist/libs/map-element ../$CURR_PROJECT/node_modules/@sixriver/

# If the application is managed by 6mon:
pm2 restart $CURR_PROJECT
```

## The Correct Way (Not Working)

**Warning:** The below instructions are known to fail when used with Chuckulator. The compilation succeeds but the
console reports: `Error: StaticInjectorError(AppModule)[HttpHandler -> Injector]`.

To test changes in an application that consumes the library:

- Ensure that the library and the application are using the same version of Node. If they are not, set them to the same
  version. `npm link` does not work across different Node versions.
- In `map-core`:
  - `npm run build` - `cd dist/libs/map-core` - `npm link`
- In the application: `npm link @sixriver/map-core`
- _Note:_ running `npm install` will remove the link and you will have to run `npm link @sixriver/map-core` again to
  reestablish it.
