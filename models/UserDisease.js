import { pool } from "../config/db.js";

export class UserDisease {
	static async addDiseaseToUser(userId, diseaseId) {
		await pool.query(
			`INSERT INTO UserDisease (userId, diseaseId) VALUES ($1, $2) 
       ON CONFLICT (userId, diseaseId) DO NOTHING`,
			[userId, diseaseId]
		);
	}

	static async removeDiseaseFromUser(userId, diseaseId) {
		await pool.query(
			`DELETE FROM UserDisease WHERE userId = $1 AND diseaseId = $2`,
			[userId, diseaseId]
		);
	}

	static async getUserDiseases(userId) {
		const { rows } = await pool.query(
			`SELECT d.* FROM Disease d 
       JOIN UserDisease ud ON d.diseaseId = ud.diseaseId 
       WHERE ud.userId = $1`,
			[userId]
		);
		return rows;
	}
}
