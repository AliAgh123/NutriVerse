import { pool } from "../config/db.js";

export class UserAllergy {
	static async addAllergyToUser(userId, allergyId) {
		await pool.query(
			`INSERT INTO UserAllergy (userId, allergyId) VALUES ($1, $2) 
       ON CONFLICT (userId, allergyId) DO NOTHING`,
			[userId, allergyId]
		);
	}

	static async removeAllergyFromUser(userId, allergyId) {
		await pool.query(
			`DELETE FROM UserAllergy WHERE userId = $1 AND allergyId = $2`,
			[userId, allergyId]
		);
	}

	static async getUserAllergies(userId) {
		const { rows } = await pool.query(
			`SELECT a.* FROM Allergies a 
       JOIN UserAllergy ua ON a.allergyId = ua.allergyId 
       WHERE ua.userId = $1`,
			[userId]
		);
		return rows;
	}
}
