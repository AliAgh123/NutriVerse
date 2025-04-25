import { BaseModel } from "./BaseModel.js";

export class ShoppingList extends BaseModel {
	static tableName = "ShoppingList";
	static primaryKey = "shoppingListId";

	static async create(userId) {
		const { rows } = await this.query(
			`INSERT INTO ${this.tableName} (userId) VALUES ($1) RETURNING *`,
			[userId]
		);
		return rows[0];
	}

	static async findByUser(userId) {
		const { rows } = await this.query(
			`SELECT * FROM ${this.tableName} WHERE userId = $1 ORDER BY created_at DESC`,
			[userId]
		);
		return rows;
	}
}
