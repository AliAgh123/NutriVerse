import { pool } from "../config/db.js";

export class IngredientAllergy {
	static async linkAllergyToIngredient(ingredientId, allergyId) {
		await pool.query(
			`INSERT INTO IngredientAllergy (ingredientId, allergyId) VALUES ($1, $2) 
       ON CONFLICT (ingredientId, allergyId) DO NOTHING`,
			[ingredientId, allergyId]
		);
	}

	static async unlinkAllergyFromIngredient(ingredientId, allergyId) {
		await pool.query(
			`DELETE FROM IngredientAllergy 
       WHERE ingredientId = $1 AND allergyId = $2`,
			[ingredientId, allergyId]
		);
	}

	static async getIngredientAllergies(ingredientId) {
		const { rows } = await pool.query(
			`SELECT a.* FROM Allergies a 
       JOIN IngredientAllergy ia ON a.allergyId = ia.allergyId 
       WHERE ia.ingredientId = $1`,
			[ingredientId]
		);
		return rows;
	}
}
