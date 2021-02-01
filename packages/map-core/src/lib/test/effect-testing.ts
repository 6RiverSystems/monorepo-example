import { hot, cold } from 'jasmine-marbles';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

/**
 * Create an object mapping arbitrary letters to actions, useful as input to a marbles test
 */
export const getExpectedValues = (values: unknown[]) => {
	const expected = {};
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	for (let i = 0; i < values.length; i++) {
		expected[alphabet.charAt(i)] = values[i];
	}
	return expected;
};

/**
 * Combine all keys of an object into a string, useful for specifying the order of observables in a marbles test
 */
export const reduceObjectKeysToString = expectedActions => Object.keys(expectedActions).join('');

/**
 * Create a marble test Observable with a single inciting action
 */
export const createInitialActionObservable = action => hot('--a-', { a: action });

/**
 * Create a marble test Observable with a set of actions that should happen after the inciting action
 */
export const createExpectedActionObservable = (actions: Action[]) => {
	const expectedActions = getExpectedValues(actions);
	return cold(`--(${reduceObjectKeysToString(expectedActions)})`, expectedActions);
};

export const createExpectedObservable = (values: unknown[]) => {
	const expectedValues = getExpectedValues(values);
	return cold(`(${reduceObjectKeysToString(expectedValues)})`, expectedValues);
}

export const expectObservable = (observable: Observable<unknown>) => {
	return {
		toEqual: (value: any) => {
			let values = [value];
			if (value as Array<unknown>) {
				values = value;
			}
			expect(observable).toBeObservable(createExpectedObservable(values));
		}	
	}
}