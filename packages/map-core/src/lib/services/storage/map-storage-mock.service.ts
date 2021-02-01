import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MapStorageService } from './map-storage.service';
import { MapStackVersionData } from '../../interfaces/map-stack-version-data';
import { MapStackMeta } from '../../interfaces/map-stack-meta';

@Injectable()
export class MapStorageMockService implements MapStorageService {
	loadFile(file: string): Observable<Blob | {}> {
		return new Observable(observer => observer.next(new Blob()));
	}

	saveFile(file: string, blob: Blob): Promise<boolean> {
		return Promise.resolve(true);
	}

	getMapStackVersionData(): Promise<MapStackVersionData> {
		return Promise.resolve({ currentGeneration: '1234', siteName: 'staging271' });
	}

	setMapStackMeta(mapStackMeta: MapStackMeta) {}
}
