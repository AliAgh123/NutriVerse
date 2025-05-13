import { Allergy } from "../models/Allergy.js";
import { UserAllergy } from "../models/UserAllergy.js";
import { IngredientAllergy } from "../models/IngredientAllergy.js";

export const allergyController = {
	// Create new allergy type
	createAllergy: async (req, res) => {
		try {
			const { allergyName, description, ingredientIds } = req.body;

			if (!allergyName) {
				return res.status(400).json({ message: "Allergy name is required" });
			}

			const existingAllergy = await Allergy.query(
				"SELECT * FROM Allergies WHERE allergyName = $1",
				[allergyName]
			);

			if (existingAllergy.rows.length > 0) {
				return res.status(200).json({
					message: "Allergy already exists",
					allergy: existingAllergy.rows[0],
				});
			}

			const {
				rows: [newAllergy],
			} = await Allergy.query(
				`INSERT INTO Allergies (allergyName, description) 
         VALUES ($1, $2) RETURNING *`,
				[allergyName, description || null]
			);

			if (ingredientIds && ingredientIds.length > 0) {
				for (const ingredientId of ingredientIds) {
					await IngredientAllergy.linkAllergyToIngredient(
						ingredientId,
						newAllergy.allergyid
					);
				}
			}

			res.status(201).json(newAllergy);
		} catch (error) {
			console.error("Create allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Add allergy to user profile
	addUserAllergy: async (req, res) => {
		try {
			const { userId } = req.user;
			const { allergyId } = req.body;

			if (!allergyId) {
				return res.status(400).json({ message: "Allergy ID is required" });
			}

			const allergy = await Allergy.findById(allergyId);
			if (!allergy) {
				return res.status(404).json({ message: "Allergy not found" });
			}

			await UserAllergy.addAllergyToUser(userId, allergyId);

			res.status(201).json({
				message: "Allergy added to your profile",
				allergy,
			});
		} catch (error) {
			console.error("Add user allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get all allergies
	getAllAllergies: async (req, res) => {
		try {
			const allergies = await Allergy.findAll();
			res.json(allergies);
		} catch (error) {
			console.error("Get allergies error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get allergy details with associated ingredients
	getAllergyDetails: async (req, res) => {
		try {
			const { id } = req.params;
			const allergy = await Allergy.findById(id);

			if (!allergy) {
				return res.status(404).json({ message: "Allergy not found" });
			}

			const ingredients = await IngredientAllergy.getIngredientAllergies(id);

			res.json({
				...allergy,
				harmfulIngredients: ingredients,
			});
		} catch (error) {
			console.error("Get allergy details error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get user's allergies
	getUserAllergies: async (req, res) => {
		try {
			const { userId } = req.user;
			const allergies = await UserAllergy.getUserAllergies(userId);
			res.json(allergies);
		} catch (error) {
			console.error("Get user allergies error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Remove allergy from user profile
	removeUserAllergy: async (req, res) => {
		try {
			const { userId } = req.user;
			const { allergyId } = req.params;

			await UserAllergy.removeAllergyFromUser(userId, allergyId);
			res.status(204).end();
		} catch (error) {
			console.error("Remove user allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Associate ingredient with allergy
	addHarmfulIngredient: async (req, res) => {
		try {
			const { allergyId, ingredientId } = req.params;

			const allergy = await Allergy.findById(allergyId);
			const ingredient = await Ingredient.findById(ingredientId);

			if (!allergy || !ingredient) {
				return res
					.status(404)
					.json({ message: "Allergy or ingredient not found" });
			}

			await IngredientAllergy.linkAllergyToIngredient(ingredientId, allergyId);
			res.status(201).json({
				message: "Ingredient added to harmful substances for this allergy",
				allergy,
				ingredient,
			});
		} catch (error) {
			console.error("Add harmful ingredient error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
};
