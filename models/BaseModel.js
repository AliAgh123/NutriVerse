import { pool } from "../config/db.js";

export class BaseModel {
	static tableName = "";

	static async query(sql, params) {
		return pool.query(sql, params);
	}

	static async findAll() {
		const { rows } = await this.query(`SELECT * FROM ${this.tableName}`);
		return rows;
	}

	static async findById(id) {
		const { rows } = await this.query(
			`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
			[id]
		);
		return rows[0];
	}

	static async deleteById(id) {
		await this.query(
			`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
			[id]
		);
	}
}
