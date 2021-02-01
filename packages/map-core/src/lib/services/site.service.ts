import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import { Site } from '../interfaces/site';

@Injectable()
export class SiteService {
	private baseUrl = `${window.location.origin}/grm/`;

	constructor(private log: NGXLogger, private http: HttpClient) {}

	getSites(): Promise<Site[]> {
		return this.http
			.get(this.baseUrl + 'sites')
			.toPromise()
			.then((response: any) => {
				return (response as Site[]).sort((a, b) => {
					return a.name.localeCompare(b.name);
				});
			})
			.catch(this.handleError.bind(this));
	}

	getSite(name: string): Promise<Site> {
		return this.getSites().then((sites: Site[]) => {
			const site: Site = sites.find(item => item.name === name);
			if (site) {
				site.layout = `${site.name}/${site.name}`;
			}

			return site;
		});
	}

	private handleError(error: any): Promise<any> {
		this.log.error('An error occurred', error); // eslint-disable-line
		return Promise.reject(error);
	}
}
