import { Chance } from 'chance';

import { Pose } from '../interfaces/pose';

/**
 * Get a random Pose instance
 */
export function getRandomPose(chance = new Chance()) {
	return new Pose(
		chance.integer({ min: 0 }),
		chance.integer({ min: 0 }),
		chance.integer({ min: 0, max: 360 }),
	);
}
