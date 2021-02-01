import { Injectable, NgZone } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { validate, ValidationError } from '@sixriver/map-validator';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip/dist/jszip.min.js';

import { MapStack } from '../class/mapstack/MapStack';
import { MapStackMeta } from '../interfaces/map-stack-meta';
import { MapStackSerializer } from '../class/serialize/MapStackSerializer';
import { MapStorageService } from './storage/map-storage.service';
import { pathBasename } from '../utils';
import { MapCoreError } from '../interfaces/map-core-error';

const FILENAME_MAPSTACK = 'map.json';
const FILENAME_OCCUPANCY = 'occupancy_grid.png';
const FILENAME_CONNECTIVITY = 'connectivity_matrix.yaml';

@Injectable()
export class MapStackService {
	constructor(private storage: MapStorageService, private log: NGXLogger, private zone: NgZone) {}

	loadMapStack(mapStackMeta?: MapStackMeta): Observable<{} | MapStack> {
		return this.storage.loadFile(mapStackMeta).pipe(
			switchMap((file: Blob) => this.loadMapStackPromise(file)),
			map((mapStack: MapStack) => {
				if (mapStackMeta) {
					mapStack.baseFileName = mapStackMeta.fileName;
				}
				return mapStack;
			}),
		);
	}

	loadLocalMapStack(file?: File): Observable<MapStack> {
		return from(this.loadMapStackPromise(file)).pipe(
			map((mapStack: MapStack) => {
				mapStack.baseFileName = `${file.name}/${file.name}`.replace(/.6rms/g, '');
				return mapStack;
			}),
		);
	}

	async loadMapStackPromise(mapStackRaw: Blob): Promise<MapStack> {
		const zipFile = await JSZip.loadAsync(mapStackRaw);

		const zippedMapStack = zipFile.file(FILENAME_MAPSTACK);

		const zippedOccupanyGrid = zipFile.file(FILENAME_OCCUPANCY);

		if (!zippedMapStack) {
			throw new MapCoreError(`Could not load ${FILENAME_MAPSTACK} from map stack.`);
		}

		if (!zippedOccupanyGrid) {
			throw new MapCoreError(`Could not load ${FILENAME_OCCUPANCY} from map stack.`);
		}

		const [mapStackJson, occupancyGridBlob] = await Promise.all([
			this.unserializeMapStack(zippedMapStack),
			this.unserializeOccupancyGrid(zippedOccupanyGrid),
		]);

		if (!mapStackJson) {
			throw new MapCoreError(`Could not parse ${FILENAME_MAPSTACK} from map stack.`);
		}

		if (!occupancyGridBlob) {
			throw new MapCoreError(`Could not parse ${FILENAME_OCCUPANCY} from map stack.`);
		}

		const occupancyGridImage = new Image();

		const onLoadPromise = new Promise(resolve => {
			occupancyGridImage.onload = () => resolve(occupancyGridImage);
		});

		occupancyGridImage.src = URL.createObjectURL(occupancyGridBlob);

		await onLoadPromise;

		const serializer: MapStackSerializer = MapStackSerializer.fromString(mapStackJson);
		const mapStack = serializer.toMapStack(occupancyGridImage, occupancyGridBlob);
		return mapStack;
	}

	async unserializeMapStack(zippedMapStack: any): Promise<string> {
		return await zippedMapStack.async('text');
	}

	async unserializeOccupancyGrid(zippedOccupanyGrid: any): Promise<Blob> {
		return await zippedOccupanyGrid.async('blob');
	}

	async saveMapStack(file: string, mapStack: MapStack): Promise<boolean> {
		const zipFile = new JSZip();

		const serializer: MapStackSerializer = MapStackSerializer.fromMapStack(mapStack);

		zipFile.file(FILENAME_MAPSTACK, serializer.toString());
		zipFile.file(FILENAME_OCCUPANCY, mapStack.occupancyGridBlob);

		const blob: Blob = await zipFile.generateAsync({ type: 'blob' });

		return this.storage.saveFile(file, blob);
	}

	async generateMapStack(mapStack: MapStack): Promise<Blob> {
		const zipFile = new JSZip();

		const serializer: MapStackSerializer = MapStackSerializer.fromMapStack(mapStack);

		zipFile.file(FILENAME_MAPSTACK, serializer.toString());
		zipFile.file(FILENAME_OCCUPANCY, mapStack.occupancyGridBlob);

		return await zipFile.generateAsync({ type: 'blob' });
	}

	async saveLocalMapStack(file: string, mapStack: MapStack): Promise<boolean> {
		const blob: Blob = await this.generateMapStack(mapStack);
		const filename = `${pathBasename(file)}.6rms`;
		FileSaver.saveAs(blob, filename);
		return true;
	}

	async validateMapStack(mapStack: MapStack): Promise<[boolean, ValidationError[]]> {
		let isValid = false;
		const serializer: MapStackSerializer = MapStackSerializer.fromMapStack(mapStack);
		// this is a bit weird. The MapStackSerializer is a class and not a pure json object
		// to get the validator to pass, we have to stringify it to sanitize it and parse it
		// to convert it back to json.
		const json = JSON.parse(JSON.stringify(serializer, undefined, 2));

		const errors: ValidationError[] = [];
		isValid = validate(json, errors);
		return [isValid, errors];
	}
}
