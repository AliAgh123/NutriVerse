import { BaseModel } from "./BaseModel.js";

export class Disease extends BaseModel {
	static tableName = "Disease";
	static primaryKey = "diseaseId";

	static async create({ diseaseName, description = null }) {
		const { rows } = await this.query(
			`INSERT INTO ${this.tableName} 
       (diseaseName, description) 
       VALUES ($1, $2) 
       RETURNING *`,
			[diseaseName, description]
		);
		return rows[0];
	}
}
