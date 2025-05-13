import { Disease } from "../models/Disease.js";
import { UserDisease } from "../models/UserDisease.js";
import { IngredientDisease } from "../models/IngredientDisease.js";

export const diseaseController = {
	// Create a new disease
	createDisease: async (req, res) => {
		try {
			const { diseaseName, description, ingredientIds } = req.body;

			if (!diseaseName) {
				return res.status(400).json({ message: "Disease name is required" });
			}

			const existingDisease = await Disease.query(
				"SELECT * FROM Disease WHERE diseaseName = $1",
				[diseaseName]
			);

			if (existingDisease.rows.length > 0) {
				return res.status(200).json({
					message: "Disease already exists",
					disease: existingDisease.rows[0],
				});
			}

			const {
				rows: [newDisease],
			} = await Disease.query(
				`INSERT INTO Disease (diseaseName, description, createdBy) 
         VALUES ($1, $2, $3) RETURNING *`,
				[diseaseName, description || null, req.user.userId]
			);

			if (ingredientIds && ingredientIds.length > 0) {
				for (const ingredientId of ingredientIds) {
					await IngredientDisease.linkIngredientToDisease(
						ingredientId,
						newDisease.diseaseid
					);
				}
			}

			res.status(201).json(newDisease);
		} catch (error) {
			console.error("Create disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	getRestrictedIngredients: async (req, res) => {
		try {
			const { id } = req.params;
			const ingredients = await IngredientDisease.getDiseaseIngredients(id);
			res.json(ingredients);
		} catch (error) {
			console.error("Get restricted ingredients error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get all diseases
	getAllDiseases: async (req, res) => {
		try {
			const { search } = req.query;
			let query = "SELECT * FROM Disease";
			const params = [];

			if (search) {
				query += " WHERE diseaseName ILIKE $1";
				params.push(`%${search}%`);
			}

			query += " ORDER BY diseaseName ASC";

			const { rows: diseases } = await Disease.query(query, params);
			res.json(diseases);
		} catch (error) {
			console.error("Get diseases error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get disease details with restricted ingredients
	getDiseaseDetails: async (req, res) => {
		try {
			const { id } = req.params;

			const disease = await Disease.findById(id);
			if (!disease) {
				return res.status(404).json({ message: "Disease not found" });
			}

			const restrictedIngredients =
				await IngredientDisease.getDiseaseIngredients(id);

			res.json({
				...disease,
				restrictedIngredients,
			});
		} catch (error) {
			console.error("Get disease details error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Update disease information
	updateDisease: async (req, res) => {
		try {
			const { id } = req.params;
			const { diseaseName, description } = req.body;

			const disease = await Disease.findById(id);
			if (!disease) {
				return res.status(404).json({ message: "Disease not found" });
			}

			if (diseaseName) disease.diseaseName = diseaseName;
			if (description !== undefined) disease.description = description;

			await Disease.query(
				`UPDATE Disease 
         SET diseaseName = $1, description = $2 
         WHERE diseaseId = $3`,
				[disease.diseaseName, disease.description, id]
			);

			res.json(disease);
		} catch (error) {
			console.error("Update disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Delete a disease
	deleteDisease: async (req, res) => {
		try {
			const { id } = req.params;

			const disease = await Disease.findById(id);
			if (!disease) {
				return res.status(404).json({ message: "Disease not found" });
			}

			await IngredientDisease.query(
				"DELETE FROM IngredientDisease WHERE diseaseId = $1",
				[id]
			);

			await UserDisease.query("DELETE FROM UserDisease WHERE diseaseId = $1", [
				id,
			]);

			await Disease.deleteById(id);

			res.status(204).end();
		} catch (error) {
			console.error("Delete disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Add ingredient to disease restrictions
	addRestrictedIngredient: async (req, res) => {
		try {
			const { diseaseId, ingredientId } = req.params;

			const disease = await Disease.findById(diseaseId);
			const ingredient = await Ingredient.findById(ingredientId);

			if (!disease || !ingredient) {
				return res
					.status(404)
					.json({ message: "Disease or ingredient not found" });
			}

			await IngredientDisease.linkIngredientToDisease(ingredientId, diseaseId);

			res.status(201).json({
				message: "Ingredient added to disease restrictions",
				disease,
				ingredient,
			});
		} catch (error) {
			console.error("Add restricted ingredient error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Remove ingredient from disease restrictions
	removeRestrictedIngredient: async (req, res) => {
		try {
			const { diseaseId, ingredientId } = req.params;
			await IngredientDisease.unlinkIngredientFromDisease(
				ingredientId,
				diseaseId
			);
			res.status(204).end();
		} catch (error) {
			console.error("Remove restricted ingredient error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Search diseases by name
	searchDiseases: async (req, res) => {
		try {
			const { q } = req.query;

			if (!q || q.length < 2) {
				return res
					.status(400)
					.json({ message: "Search query must be at least 2 characters" });
			}

			const { rows: diseases } = await Disease.query(
				"SELECT * FROM Disease WHERE diseaseName ILIKE $1 LIMIT 10",
				[`%${q}%`]
			);

			res.json(diseases);
		} catch (error) {
			console.error("Search diseases error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
};
