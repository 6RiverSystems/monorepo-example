export type SiteId = string;
export type SiteName = string;
export type SiteLayout = string;

export class Site {
	id: SiteId;
	name: SiteName;
	layout: SiteLayout;

	// globalConfig interface does not exist yet on cfs_models so it is defined here
	globalConfig: {
		googleCloudStorage: {
			mapStack: any;
		};
	};

	constructor({
		id = '',
		name = '',
		layout = '',
		globalConfig = {
			googleCloudStorage: {
				mapStack: {},
			},
		},
	}) {
		this.id = id;
		this.name = name;
		this.layout = layout;
		this.globalConfig = globalConfig;
	}
}
