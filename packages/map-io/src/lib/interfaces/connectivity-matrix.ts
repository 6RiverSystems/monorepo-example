export interface MatrixElement {
	start: string;
	end: string;
	cost: number;
}

export class ConnectivityMatrix {
	public sha256: string;

	public matrix: MatrixElement[] = [];

	constructor() {}
}
