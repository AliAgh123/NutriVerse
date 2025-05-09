import { BaseModel } from "./BaseModel.js";

export class User extends BaseModel {
	static tableName = "Users";
	static primaryKey = "userId";

	static async create({
		email,
		password,
		fats = null,
		proteins = null,
		carbs = null,
	}) {
		const { rows } = await this.query(
			`INSERT INTO ${this.tableName} 
       (email, password, fats, proteins, carbs) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
			[email, password, fats, proteins, carbs]
		);
		return rows[0];
	}

	static async findByEmail(email) {
		const { rows } = await this.query(
			`SELECT * FROM ${this.tableName} WHERE email = $1`,
			[email]
		);
		return rows[0];
	}

	static async updateMacros(userId, { fats, proteins, carbs }) {
		const { rows } = await this.query(
			`UPDATE ${this.tableName} 
       SET fats = $1, proteins = $2, carbs = $3 
       WHERE userId = $4 
       RETURNING *`,
			[fats, proteins, carbs, userId]
		);
		return rows[0];
	}

	static async awardPoints(userId, points) {
		const { rows } = await this.query(
			`UPDATE ${this.tableName} 
		   SET points = points + $1 
		   WHERE userId = $2 
		   RETURNING *`,
			[points, userId]
		);
		return rows[0];
	}

	static async deductPoints(userId, points) {
		const { rows } = await this.query(
			`UPDATE ${this.tableName} 
		   SET points = GREATEST(points - $1, 0) 
		   WHERE userId = $2 
		   RETURNING *`,
			[points, userId]
		);
		return rows[0];
	}

	static async getUserWithPoints(userId) {
		const { rows } = await this.query(
			`SELECT userId, email, points 
		   FROM ${this.tableName} 
		   WHERE userId = $1`,
			[userId]
		);
		return rows[0];
	}
}
