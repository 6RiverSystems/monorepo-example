import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MapStackVersionData } from '../../interfaces/map-stack-version-data';
import { MapStackMeta } from '../../interfaces/map-stack-meta';

@Injectable()
export abstract class MapStorageService {
	abstract loadFile(mapStackMeta?: any): Observable<Blob | {}>;

	abstract saveFile(file: string, blob: Blob, forceSave?: boolean): Promise<boolean>;

	/**
	 * Get Map Stack version metadata for the currently loaded Map Stack
	 *
	 * This information can be used, for instance, to display the current version
	 * of the loaded map stack, or to check whether the currently loaded map stack
	 * is the most recent one.
	 */
	abstract getMapStackVersionData(): Promise<MapStackVersionData>;

	abstract setMapStackMeta(mapStackMeta: MapStackMeta): void;
}
