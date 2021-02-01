/*
 * (c) Copyright 2018 6 River Systems, all rights reserved.
 *
 * This is proprietary software, unauthorized distribution is not permitted.
 */
import { ParseUtils } from './ParseUtils';

export class ConnectivityMatrixSerializer {
	constructor(public matrix: ConnectivityNode[]) {}

	static loadFromJSON(json: object): ConnectivityMatrixSerializer {
		const rawMatrix: object[] = ParseUtils.getRequiredField(json, 'matrix', 'object');

		const matrix: ConnectivityNode[] = [];

		rawMatrix.forEach((entry: object) => {
			const start: string = ParseUtils.getRequiredField(entry, 'start', 'string');
			const end: string = ParseUtils.getRequiredField(entry, 'end', 'string');
			const cost: number = ParseUtils.getRequiredField(entry, 'cost', 'number');

			matrix.push(new ConnectivityNode(start, end, cost));
		});

		return new ConnectivityMatrixSerializer(matrix);
	}
}

export class ConnectivityNode {
	constructor(public start: string, public end: string, public cost: number) {}
}
