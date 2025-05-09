import { BaseModel } from "./BaseModel.js";

export class Ingredient extends BaseModel {
	static tableName = "Ingredient";
	static primaryKey = "ingredientId";

	static async create({ ingredientName, description = null }) {
		const { rows } = await this.query(
			`INSERT INTO ${this.tableName} 
       (ingredientName, description) 
       VALUES ($1, $2) 
       RETURNING *`,
			[ingredientName, description]
		);
		return rows[0];
	}
}
