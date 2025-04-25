import { pool } from "../config/db.js";

export class ShoppingListIngredient {
	static async addIngredientToList(shoppingListId, ingredientId, quantity = 1) {
		await pool.query(
			`INSERT INTO ShoppingListIngredient 
       (shoppingListId, ingredientId, quantity) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (shoppingListId, ingredientId) 
       DO UPDATE SET quantity = $3`,
			[shoppingListId, ingredientId, quantity]
		);
	}

	static async removeIngredientFromList(shoppingListId, ingredientId) {
		await pool.query(
			`DELETE FROM ShoppingListIngredient 
       WHERE shoppingListId = $1 AND ingredientId = $2`,
			[shoppingListId, ingredientId]
		);
	}

	static async getListIngredients(shoppingListId) {
		const { rows } = await pool.query(
			`SELECT i.*, sli.quantity 
       FROM Ingredient i 
       JOIN ShoppingListIngredient sli ON i.ingredientId = sli.ingredientId 
       WHERE sli.shoppingListId = $1`,
			[shoppingListId]
		);
		return rows;
	}
}
