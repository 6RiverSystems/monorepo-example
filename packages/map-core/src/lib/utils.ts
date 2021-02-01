import { MapCoreError } from './interfaces/map-core-error';
/**
 * Utility functions
 */

/**
 * Creates an HTMLImageElement object from a URL to the image.
 *
 * i.e.:
 *
 * const image: HTMLImageElement = await createHtmlImageElement(mapStackData.occupancyGridObjectUrl);
 */
export function createHtmlImageElement(imageObjectUrl: string): Promise<HTMLImageElement> {
	const image = new Image();
	image.src = imageObjectUrl;
	return new Promise(resolve => (image.onload = () => resolve(image)));
}

/**
 * Get the basename of a path.
 * @example
 * pathBasename('/path/to/my/file.txt')
 * // 'file'
 */
export const pathBasename = (path: string) =>
	path
		.split(/[\\/]/g)
		.pop()
		.split('.')[0];

/**
 * Intersection (a ∩ b): create a set that contains those elements of set a that are also in set b.
 */
export function intersection(a: Set<any>, b: Set<any>) {
	return new Set([...a].filter(x => b.has(x)));
}

/**
 * Difference (a \ b): create a set that contains those elements of set a that are not in set b.
 * This operation is also sometimes called minus (-).
 */
export function difference(a: Set<any>, b: Set<any>) {
	return new Set([...a].filter(x => !b.has(x)));
}

export function assert(condition: any, message: string) {
	if (!Boolean(condition)) {
		throw new MapCoreError(message);
	}
}

/**
 * This can be replaced with Object.fromEntries that should be available with es2019
 * @param arr
 */
export function fromEntries(entries: IterableIterator<[any, unknown]>): object {
	return Object.assign({}, ...Array.from(entries, ([k, v]) => ({ [k]: v })));
}


/**
 * Convert a map to an Object
 * @param inputMap a Map
 */
export function mapToObj(inputMap: Map<unknown,unknown>): object {
	return fromEntries(inputMap.entries());
}

/**
 * Convert an object to a map
 * @param obj an object
 */
export function objToMap(obj: object):  Map<unknown,unknown> {
	const strMap = new Map();
	for (const k of Object.keys(obj)) {
	strMap.set(k, obj[k]);
	}
	return strMap;
}
