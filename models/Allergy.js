import { BaseModel } from "./BaseModel.js";

export class Allergy extends BaseModel {
	static tableName = "Allergies";
	static primaryKey = "allergyId";

	static async create({ allergyName, description = null }) {
		const { rows } = await this.query(
			`INSERT INTO ${this.tableName} 
       (allergyName, description) 
       VALUES ($1, $2) 
       RETURNING *`,
			[allergyName, description]
		);
		return rows[0];
	}
}
