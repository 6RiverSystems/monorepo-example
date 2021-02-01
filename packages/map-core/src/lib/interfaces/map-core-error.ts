export class MapCoreError extends Error {
	origin?: Error;

	constructor(message: string, error?: Error) {
		super(message);

		this.origin = error;
	}
}
