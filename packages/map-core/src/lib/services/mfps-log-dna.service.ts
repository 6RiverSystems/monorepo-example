import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { Mfp } from '../interfaces/mfp';

@Injectable()
export class MfpsLogDnaService {
	private baseUrl = `${window.location.origin}/logs/export`;

	private lastRequest: number;

	constructor(private log: NGXLogger, private http: HttpClient) {}

	getMfps(siteName: string): Observable<Map<string, Mfp>> {
		const now = new Date();
		const nowEpoc = now.getTime();

		if (!this.lastRequest) {
			// For the first request pull the last hour of logs for the site
			this.lastRequest = 0;
		}

		const params: HttpParams = new HttpParams()
			.set('from', this.lastRequest.toString())
			.set('to', nowEpoc.toString())
			.set('size', '1000')
			.set('query', `(tag:${siteName})(component:/move_base)`);

		return this.http.get(this.baseUrl, { params, responseType: 'text' }).pipe(
			map(result => {
				this.lastRequest = nowEpoc;

				const logLines: string[] = result.split('\n');

				const mfps: Map<string, Mfp> = new Map<string, Mfp>();

				logLines.forEach((logLine: string) => {
					try {
						const logObject: any = JSON.parse(logLine);

						const mfp: any = logObject.mfp;

						if (mfp && mfp.pose) {
							mfp.updated = now;
							mfps.set(mfp.id, mfp);
						}
					} catch (e) {
						// Ignore
					}
				});

				return mfps;
			}),
		);
	}

	getMfp(id: string): Observable<Mfp> {
		return this.getMfps('xpomem').pipe(
			map((mfps: Map<string, Mfp>) => {
				const mfp: Mfp = mfps[id];
				return mfp;
			}),
		);
	}
}
