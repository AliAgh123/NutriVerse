import { Ingredient } from "../models/Ingredient.js";
import { IngredientAllergy } from "../models/IngredientAllergy.js";
import { IngredientDisease } from "../models/IngredientDisease.js";
import { ShoppingListIngredient } from "../models/ShoppingListIngredient.js";

export const ingredientController = {
	createIngredient: async (req, res) => {
		try {
			const { ingredientName, description, allergyIds, diseaseIds } = req.body;

			if (!ingredientName) {
				return res.status(400).json({ message: "Ingredient name is required" });
			}

			const existingIngredient = await Ingredient.query(
				"SELECT * FROM Ingredient WHERE ingredientName = $1",
				[ingredientName]
			);

			if (existingIngredient.rows.length > 0) {
				return res.status(200).json({
					message: "Ingredient already exists",
					ingredient: existingIngredient.rows[0],
				});
			}

			const {
				rows: [newIngredient],
			} = await Ingredient.query(
				`INSERT INTO Ingredient (ingredientName, description, createdBy) 
         VALUES ($1, $2, $3) RETURNING *`,
				[ingredientName, description || null, req.user.userId]
			);

			if (allergyIds?.length) {
				for (const allergyId of allergyIds) {
					await IngredientAllergy.linkAllergyToIngredient(
						newIngredient.ingredientid,
						allergyId
					);
				}
			}

			if (diseaseIds?.length) {
				for (const diseaseId of diseaseIds) {
					await IngredientDisease.linkIngredientToDisease(
						newIngredient.ingredientid,
						diseaseId
					);
				}
			}

			res.status(201).json(newIngredient);
		} catch (error) {
			console.error("Create ingredient error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	getIngredientDetails: async (req, res) => {
		try {
			const { id } = req.params;
			const ingredient = await Ingredient.findById(id);
			if (!ingredient) {
				return res.status(404).json({ message: "Ingredient not found" });
			}

			const allergies = await IngredientAllergy.getIngredientAllergies(id);
			const diseases = await IngredientDisease.getIngredientDiseases(id);

			res.json({
				...ingredient,
				relatedAllergies: allergies,
				relatedDiseases: diseases,
			});
		} catch (error) {
			console.error("Get ingredient details error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	addIngredientDisease: async (req, res) => {
		try {
			const { ingredientId, diseaseId } = req.params;
			const ingredient = await Ingredient.findById(ingredientId);
			const disease = await Disease.findById(diseaseId);

			if (!ingredient || !disease) {
				return res
					.status(404)
					.json({ message: "Ingredient or disease not found" });
			}

			await IngredientDisease.linkIngredientToDisease(ingredientId, diseaseId);

			res.status(201).json({
				message: "Disease added to ingredient restrictions",
				ingredient,
				disease,
			});
		} catch (error) {
			console.error("Add ingredient disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	removeIngredientDisease: async (req, res) => {
		try {
			const { ingredientId, diseaseId } = req.params;
			await IngredientDisease.unlinkIngredientFromDisease(
				ingredientId,
				diseaseId
			);
			res.status(204).end();
		} catch (error) {
			console.error("Remove ingredient disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	getAllIngredients: async (req, res) => {
		try {
			const { search } = req.query;
			let query = "SELECT * FROM Ingredient";
			const params = [];

			if (search) {
				query += " WHERE ingredientName ILIKE $1";
				params.push(`%${search}%`);
			}

			query += " ORDER BY ingredientName ASC";

			const { rows: ingredients } = await Ingredient.query(query, params);
			res.json(ingredients);
		} catch (error) {
			console.error("Get ingredients error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	addIngredientAllergy: async (req, res) => {
		try {
			const { ingredientId, allergyId } = req.params;

			const ingredient = await Ingredient.findById(ingredientId);
			const allergy = await Allergy.findById(allergyId);

			if (!ingredient || !allergy) {
				return res
					.status(404)
					.json({ message: "Ingredient or allergy not found" });
			}

			await IngredientAllergy.linkAllergyToIngredient(ingredientId, allergyId);

			res.status(201).json({
				message: "Allergy added to ingredient",
				ingredient,
				allergy,
			});
		} catch (error) {
			console.error("Add ingredient allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Remove allergy from ingredient
	removeIngredientAllergy: async (req, res) => {
		try {
			const { ingredientId, allergyId } = req.params;

			await IngredientAllergy.unlinkAllergyFromIngredient(
				ingredientId,
				allergyId
			);
			res.status(204).end();
		} catch (error) {
			console.error("Remove ingredient allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Search ingredients by name
	searchIngredients: async (req, res) => {
		try {
			const { q } = req.query;

			if (!q || q.length < 2) {
				return res
					.status(400)
					.json({ message: "Search query must be at least 2 characters" });
			}

			const { rows: ingredients } = await Ingredient.query(
				"SELECT * FROM Ingredient WHERE ingredientName ILIKE $1 LIMIT 10",
				[`%${q}%`]
			);

			res.json(ingredients);
		} catch (error) {
			console.error("Search ingredients error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get popular ingredients
	getPopularIngredients: async (req, res) => {
		try {
			const { rows: ingredients } = await Ingredient.query(
				`SELECT i.*, COUNT(sli.ingredientId) as popularity 
         FROM Ingredient i
         LEFT JOIN ShoppingListIngredient sli ON i.ingredientId = sli.ingredientId
         GROUP BY i.ingredientId
         ORDER BY popularity DESC
         LIMIT 10`
			);

			res.json(ingredients);
		} catch (error) {
			console.error("Get popular ingredients error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
};
