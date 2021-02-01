export interface MapStackMeta {
	/**
	 * File name of the map stack
	 */
	fileName: string;

	/**
	 * Google Cloud Storage version of the mapstack file
	 */
	generation: string | null;

	/**
	 * Whether or not the MapStack is a newly created MapStack in Map Editor and has not yet been saved to the cloud
	 */
	newMapStack?: boolean;
}
