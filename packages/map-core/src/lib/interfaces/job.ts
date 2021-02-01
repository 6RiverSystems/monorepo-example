import { IUserTaskData } from '@sixriver/cfs_models';

/**
 * Workaround for not having access to actual jobs
 * @description This class contains a list of `IUserTaskData` and provides methods that allow interaction with these
 * tasks as if they are in a job.
 */
export class Job {
	lines: IUserTaskData[];
	assetTypes: any;

	constructor({ lines = <IUserTaskData[]>null, assetTypes = <any[]>null }) {
		this.lines = lines;
		this.assetTypes = assetTypes;
	}

	/**
	 * Any line with a set `completedAt` value is considered completed
	 */
	getCompletedLines() {
		return this.lines.filter(line => line.completedAt);
	}

	/**
	 * Total quantity of all lines in the job
	 */
	getQuantity() {
		return this.lines.reduce((sum, line) => (sum += line.quantity), 0);
	}

	/**
	 * Total quantity of all lines in the job that are completed
	 */
	getDoneQuantity() {
		return this.getCompletedLines().reduce((sum, line) => (sum += line.quantity), 0);
	}

	/**
	 * Get a specified asset type from the job's `assetTypes`
	 */
	getAssetType(productTypeId: string) {
		if (!this.assetTypes && !this.assetTypes[productTypeId]) {
			return;
		}
		return this.assetTypes[productTypeId];
	}
}
