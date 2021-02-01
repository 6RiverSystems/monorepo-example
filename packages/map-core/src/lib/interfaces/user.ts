export class User {
	id: string;
	badgeBarcode: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;

	constructor({
		id = '',
		badgeBarcode = '',
		name = '',
		createdAt = new Date(),
		updatedAt = new Date(),
	}) {
		this.id = id;
		this.badgeBarcode = badgeBarcode;
		this.name = name;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
