import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { writeFileSync, createWriteStream, readFileSync } from 'fs';
import JSZip from 'jszip';

type SiteConfig = { site: string; updatedAt: string; googleCloudStorage: object };
@Injectable()
export class AppService implements OnModuleInit {
	onModuleInit() {
		//Allows us to  get cosnole messages for requests
		this.httpService.axiosRef.interceptors.request.use(config => {
			return config;
		});
	}
	// Creates a client
	private storage: Storage;

	constructor(private httpService: HttpService) {
		this.storage = new Storage({
			projectId: 'plasma-column-128721',
		});
	}
	async getData(id): Promise<{ message: string }> {
		//sample map id = 'staging271'
		const bucket = this.storage.bucket('site-layouts-staging');
		const file = bucket.file(`${id}/${id}.6rms`); /// Use this to point to a map location
		const results = await file.download();
		let buffer = results[0];
		writeFileSync('/tmp/map.zip', buffer);
		const mapFile = readFileSync('/tmp/map.zip');
		const mapStackZip = await JSZip.loadAsync(mapFile);
		const mapStack = await mapStackZip.file('map.json').async('string');
		return { message: JSON.parse(mapStack) };
	}

	async requestGrmConfig(): Promise<{ data: any }> {
		const endpoint = 'https://grm-staging.6river.org/v1/Sites';
		const result = await this.httpService
			.get(endpoint, {
				auth: {
					username: 'STAGING_GRM',
					password: '6hbQ4qHfE0JP088',
				},
			})
			.toPromise();
		return result;
	}
	async getConfiguration(siteId): Promise<SiteConfig | SiteConfig[]> {
		const result = await this.requestGrmConfig();
		const data = result.data;
		//get all sites data
		const sites = data.map(({ name, updatedAt, globalConfig }) => {
			return {
				site: name,
				updatedAt,
				googleCloudStorage: globalConfig.googleCloudStorage,
			};
		});
		//Get one site if param exists
		if (siteId != null) {
			const currentSite = sites.find(site => site.site === siteId);
			return currentSite;
		} else {
			return sites;
		}
	}

	async generate_connectivity_matrix(mapStack): Promise<{}> {
		const result = await this.httpService
			.post('https://mapeditor-staging.6river.org/path-planner/generate', {
				mapStack,
			})
			.toPromise();
		return result;
	}

	async saveMap(mapName, jsonMap): Promise<{ message: string }> {
		let data = JSON.stringify(jsonMap);
		//Compress that JOSN file and write it to temp then to bucket
		const zip = JSZip();
		zip.file(`${mapName}.json`, data);
		try {
			let mapStackBlob = await zip.generateAsync({ type: 'string' });
			const connectivityMatrix = await this.generate_connectivity_matrix(mapStackBlob);
		} catch (error) {
			console.log(error);
		}
		zip
			.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
			.pipe(createWriteStream(`/tmp/${mapName}.zip`))
			.on('finish', async () => {
				//upload that local zip to google bucket
				const options = { destination: `${mapName}/${mapName}.zip` };
				const bucket = this.storage.bucket('site-layouts-staging');
				try {
					await bucket.upload(`/tmp/${mapName}.zip`, options);
				} catch (err) {
					console.log(err);
				}
			});
		return { message: 'complete' };
	}
}
