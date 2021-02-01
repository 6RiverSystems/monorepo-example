import { MfpsActions, MfpsActionTypes } from './mfps.actions';
import { Mfp, MfpParams } from '../interfaces/mfp';

export interface Filter {
	name: string;
	color: string;
	ids: string[];
}
export interface MfpState {
	mfps: Map<string, Mfp>;
	filter: Filter;
	error: Error;
}

export const mfpsInitialState: MfpState = {
	mfps: new Map<string, Mfp>(),
	filter: null,
	error: null,
};

/**
 * Update an MFP in a list of MFPs
 * @param mfps Current list of MFPs
 * @param newMfp New parameters to either add or update an MFP with
 * @return Updated list of MFPs
 */
const updateMfp = (mfps: Map<string, Mfp>, newMfp: MfpParams): Map<string, Mfp> => {
	let updatedMfp: Mfp;
	if (mfps.has(newMfp.id)) {
		// Merge the new parameters with the existing MFP
		const mfp = mfps.get(newMfp.id);
		updatedMfp = new Mfp({ ...mfp, ...newMfp });
	} else {
		// Create new MFP
		updatedMfp = new Mfp(newMfp);
	}

	return new Map(mfps).set(newMfp.id, updatedMfp);
};

export function mfpsReducer(state = mfpsInitialState, action: MfpsActions): MfpState {
	switch (action.type) {
		case MfpsActionTypes.ListenError:
		case MfpsActionTypes.ListenWorkError:
		case MfpsActionTypes.FetchError: {
			return {
				...state,
				error: action.payload,
			};
		}

		case MfpsActionTypes.FetchComplete:
		case MfpsActionTypes.ListenWorkComplete: {
			return {
				...state,
				mfps: updateMfp(state.mfps, action.payload),
			};
		}
		case MfpsActionTypes.Filter:
			return {
				...state,
				filter: { ...action.payload, ids: [...action.payload.ids] },
			};

		case MfpsActionTypes.Listen:
		case MfpsActionTypes.ListenWork:
		case MfpsActionTypes.Fetch:
		default:
			return state;
	}
}
