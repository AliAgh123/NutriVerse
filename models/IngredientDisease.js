import { pool } from "../config/db.js";

export class IngredientDisease {
	static async linkIngredientToDisease(ingredientId, diseaseId) {
		await pool.query(
			`INSERT INTO IngredientDisease (ingredientId, diseaseId) 
       VALUES ($1, $2) 
       ON CONFLICT (ingredientId, diseaseId) DO NOTHING`,
			[ingredientId, diseaseId]
		);
	}

	static async unlinkIngredientFromDisease(ingredientId, diseaseId) {
		await pool.query(
			`DELETE FROM IngredientDisease 
       WHERE ingredientId = $1 AND diseaseId = $2`,
			[ingredientId, diseaseId]
		);
	}

	static async getIngredientDiseases(ingredientId) {
		const { rows } = await pool.query(
			`SELECT d.* FROM Disease d
       JOIN IngredientDisease id ON d.diseaseId = id.diseaseId
       WHERE id.ingredientId = $1`,
			[ingredientId]
		);
		return rows;
	}

	static async getDiseaseIngredients(diseaseId) {
		const { rows } = await pool.query(
			`SELECT i.* FROM Ingredient i
       JOIN IngredientDisease id ON i.ingredientId = id.ingredientId
       WHERE id.diseaseId = $1`,
			[diseaseId]
		);
		return rows;
	}
}
