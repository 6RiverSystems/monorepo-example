import { uuid } from '@sixriver/map-io';

export interface SelectionReport {
	readonly selected: Set<uuid>;
	readonly deltaSelected: Set<uuid>;
	readonly deltaDeselected: Set<uuid>;
	readonly primary: uuid;
}

/**
 * Interface that describes a service for selecting and deselecting groups of features.
 */
export abstract class SelectionService {
	/**
	 * Get the collection of selected features
	 */
	abstract get selected(): Set<uuid>;
	/**
	 * The primary selected feature is the current selected and is updated when a feature is selected
	 */
	abstract get primary(): uuid | undefined;
	/**
	 * Add a new feature to the selection group.
	 * @param appendToSelection When true, append this feature to the selection list, when false, clear the selection
	 * list and select this feature.
	 */
	abstract select(featureId: uuid | uuid[], appendToSelection?: boolean): void;
	/**
	 * Remove a feature or a group of features from the selection group.
	 * @param featureId
	 */
	abstract deselect(featureId: uuid | uuid[]): void;
	/**
	 * Remove all features from the selection group.
	 */
	abstract clear(): void;
}
