import EdamamService from "../services/edamamService.js";
import { ShoppingList } from "../models/ShoppingList.js";
import { ShoppingListIngredient } from "../models/ShoppingListIngredient.js";
import { Ingredient } from "../models/Ingredient.js";
import { UserAllergy } from "../models/UserAllergy.js";
import { UserDisease } from "../models/UserDisease.js";
import { IngredientAllergy } from "../models/IngredientAllergy.js";
import { IngredientDisease } from "../models/IngredientDisease.js";
import { User } from "../models/User.js";

export const shoppingListController = {
	// Create a new shopping list
	createList: async (req, res) => {
		try {
			const { userId } = req.user;
			const newList = await ShoppingList.create(userId);
			res.status(201).json(newList);
		} catch (error) {
			console.error("Create shopping list error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get all shopping lists for a user
	getUserLists: async (req, res) => {
		try {
			const { userId } = req.user;
			const lists = await ShoppingList.findByUser(userId);
			res.json(lists);
		} catch (error) {
			console.error("Get user lists error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get shopping list details with ingredients
	getListDetails: async (req, res) => {
		try {
			const { id } = req.params;
			const list = await ShoppingList.findById(id);

			if (!list) {
				return res.status(404).json({ message: "Shopping list not found" });
			}

			const ingredients = await ShoppingListIngredient.getListIngredients(id);
			res.json({ ...list, ingredients });
		} catch (error) {
			console.error("Get list details error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Add ingredient to shopping list with health checks
	addIngredientToList: async (req, res) => {
		try {
			const { id } = req.params;
			const { ingredientId, quantity = 1 } = req.body;
			const { userId } = req.user;

			const ingredient = await Ingredient.findById(ingredientId);
			if (!ingredient) {
				return res.status(404).json({ message: "Ingredient not found" });
			}

			const list = await ShoppingList.findById(id);
			if (!list || list.userid !== userId) {
				return res.status(404).json({ message: "Shopping list not found" });
			}

			const userAllergies = await UserAllergy.getUserAllergies(userId);
			const ingredientAllergies =
				await IngredientAllergy.getIngredientAllergies(ingredientId);

			const allergyConflict = userAllergies.some((allergy) =>
				ingredientAllergies.some((ia) => ia.allergyid === allergy.allergyid)
			);

			const userDiseases = await UserDisease.getUserDiseases(userId);
			const ingredientDiseases = await IngredientDisease.getIngredientDiseases(
				ingredientId
			);

			const diseaseConflict = userDiseases.some((disease) =>
				ingredientDiseases.some((id) => id.diseaseid === disease.diseaseid)
			);

			await ShoppingListIngredient.addIngredientToList(
				id,
				ingredientId,
				quantity
			);

			const response = {
				message: "Ingredient added to shopping list",
				ingredient,
				quantity,
				warnings: [],
			};

			if (allergyConflict) {
				response.warnings.push(
					"This ingredient may contain allergens you are sensitive to"
				);
			}

			if (diseaseConflict) {
				response.warnings.push(
					"This ingredient may not be suitable for your health conditions"
				);
			}

			res.status(201).json(response);
		} catch (error) {
			console.error("Add ingredient error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Remove ingredient from shopping list
	removeIngredientFromList: async (req, res) => {
		try {
			const { id, ingredientId } = req.params;
			const { userId } = req.user;

			const list = await ShoppingList.findById(id);
			if (!list || list.userid !== userId) {
				return res.status(404).json({ message: "Shopping list not found" });
			}

			await ShoppingListIngredient.removeIngredientFromList(id, ingredientId);
			res.status(204).end();
		} catch (error) {
			console.error("Remove ingredient error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Update ingredient quantity in shopping list
	updateIngredientQuantity: async (req, res) => {
		try {
			const { id, ingredientId } = req.params;
			const { quantity } = req.body;
			const { userId } = req.user;

			const list = await ShoppingList.findById(id);
			if (!list || list.userid !== userId) {
				return res.status(404).json({ message: "Shopping list not found" });
			}

			if (!quantity || quantity <= 0) {
				return res.status(400).json({ message: "Valid quantity is required" });
			}

			await ShoppingListIngredient.addIngredientToList(
				id,
				ingredientId,
				quantity
			);
			res.json({
				message: "Quantity updated",
				ingredientId,
				newQuantity: quantity,
			});
		} catch (error) {
			console.error("Update quantity error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Delete shopping list
	deleteList: async (req, res) => {
		try {
			const { id } = req.params;
			const { userId } = req.user;

			const list = await ShoppingList.findById(id);
			if (!list || list.userid !== userId) {
				return res.status(404).json({ message: "Shopping list not found" });
			}

			await ShoppingList.deleteList(id);
			res.status(204).end();
		} catch (error) {
			console.error("Delete list error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Generate smart shopping list based on health profile
	generateSmartList: async (req, res) => {
		try {
			const { userId } = req.user;
			const { recipeIngredients } = req.body;

			const userAllergies = await UserAllergy.getUserAllergies(userId);
			const userDiseases = await UserDisease.getUserDiseases(userId);

			const safeIngredients = await Promise.all(
				recipeIngredients.map(async (ing) => {
					const ingredient = await Ingredient.findById(ing.ingredientId);
					if (!ingredient) return null;

					const ingredientAllergies =
						await IngredientAllergy.getIngredientAllergies(ing.ingredientId);
					const allergyConflict = userAllergies.some((allergy) =>
						ingredientAllergies.some((ia) => ia.allergyid === allergy.allergyid)
					);

					const ingredientDiseases =
						await IngredientDisease.getIngredientDiseases(ing.ingredientId);
					const diseaseConflict = userDiseases.some((disease) =>
						ingredientDiseases.some((id) => id.diseaseid === disease.diseaseid)
					);

					if (!allergyConflict && !diseaseConflict) {
						return {
							ingredientId: ing.ingredientId,
							name: ingredient.ingredientname,
							quantity: ing.quantity,
							safe: true,
						};
					}
					return {
						ingredientId: ing.ingredientId,
						name: ingredient.ingredientname,
						quantity: ing.quantity,
						safe: false,
						warnings: [
							...(allergyConflict ? ["Allergy conflict"] : []),
							...(diseaseConflict ? ["Disease restriction"] : []),
						],
					};
				})
			);

			const newList = await ShoppingList.create(userId);

			const addedIngredients = [];
			for (const ing of safeIngredients.filter((i) => i?.safe)) {
				await ShoppingListIngredient.addIngredientToList(
					newList.shoppinglistid,
					ing.ingredientId,
					ing.quantity
				);
				addedIngredients.push(ing);
			}

			res.status(201).json({
				listId: newList.shoppinglistid,
				addedIngredients,
				excludedIngredients: safeIngredients.filter((i) => i && !i.safe),
			});
		} catch (error) {
			console.error("Generate smart list error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	fromEdamam: async (req, res) => {
		try {
			const { userId } = req.user;
			const { ingredients } = req.body;

			if (!ingredients || !Array.isArray(ingredients)) {
				return res.status(400).json({ message: "Ingredients array required" });
			}

			const resolvedIngredients = [];

			for (const item of ingredients) {
				const { text, quantity = 1 } = item;

				const foods = await EdamamService.searchFoodItems(text);
				const label = foods[0]?.label || text;

				let ingredient = await Ingredient.query(
					"SELECT * FROM Ingredient WHERE ingredientName ILIKE $1 LIMIT 1",
					[`%${label}%`]
				).then((res) => res.rows[0]);

				if (!ingredient) {
					const {
						rows: [newIngredient],
					} = await Ingredient.query(
						`INSERT INTO Ingredient (ingredientName, description)
             VALUES ($1, $2) RETURNING *`,
						[label, `Imported from Edamam: ${text}`]
					);
					ingredient = newIngredient;
				}

				resolvedIngredients.push({
					ingredientId: ingredient.ingredientid,
					ingredientName: ingredient.ingredientname,
					quantity,
				});
			}

			const userAllergies = await UserAllergy.getUserAllergies(userId);
			const userDiseases = await UserDisease.getUserDiseases(userId);

			const safeIngredients = await Promise.all(
				resolvedIngredients.map(async (ing) => {
					const ingredientAllergies =
						await IngredientAllergy.getIngredientAllergies(ing.ingredientId);
					const allergyConflict = userAllergies.some((ua) =>
						ingredientAllergies.some((ia) => ia.allergyid === ua.allergyid)
					);

					const ingredientDiseases =
						await IngredientDisease.getIngredientDiseases(ing.ingredientId);
					const diseaseConflict = userDiseases.some((ud) =>
						ingredientDiseases.some((id) => id.diseaseid === ud.diseaseid)
					);

					if (!allergyConflict && !diseaseConflict) {
						return { ...ing, safe: true };
					} else {
						return {
							...ing,
							safe: false,
							warnings: [
								...(allergyConflict ? ["Allergy conflict"] : []),
								...(diseaseConflict ? ["Disease restriction"] : []),
							],
						};
					}
				})
			);

			const newList = await ShoppingList.create(userId);
			const added = [];

			for (const ing of safeIngredients.filter((i) => i.safe)) {
				await ShoppingListIngredient.addIngredientToList(
					newList.shoppinglistid,
					ing.ingredientId,
					ing.quantity
				);
				added.push(ing);
			}

			let totalMacros = { fat: 0, protein: 0, carbs: 0 };

			for (const item of ingredients) {
				const foodInfo = await EdamamService.searchFoodItems(item.text);
				const nutrients = foodInfo[0]?.nutrients || {};

				totalMacros.fat += nutrients.FAT || 0;
				totalMacros.protein += nutrients.PROCNT || 0;
				totalMacros.carbs += nutrients.CHOCDF || 0;
			}

			const user = await User.findById(userId);
			const warnings = [];

			if (user.fats && totalMacros.fat > user.fats) {
				warnings.push(
					`Total fat (${totalMacros.fat.toFixed(1)}g) exceeds your goal (${
						user.fats
					}g)`
				);
			}
			if (user.proteins && totalMacros.protein > user.proteins) {
				warnings.push(
					`Total protein (${totalMacros.protein.toFixed(
						1
					)}g) exceeds your goal (${user.proteins}g)`
				);
			}
			if (user.carbs && totalMacros.carbs > user.carbs) {
				warnings.push(
					`Total carbs (${totalMacros.carbs.toFixed(1)}g) exceeds your goal (${
						user.carbs
					}g)`
				);
			}

			await ShoppingList.setMacros(newList.shoppinglistid, totalMacros);

			res.status(201).json({
				listId: newList.shoppinglistid,
				addedIngredients: added,
				excludedIngredients: safeIngredients.filter((i) => !i.safe),
				macros: {
					fat: totalMacros.fat.toFixed(1),
					protein: totalMacros.protein.toFixed(1),
					carbs: totalMacros.carbs.toFixed(1),
				},
				macroWarnings: warnings,
			});
		} catch (error) {
			console.error("From-Edamam error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
};
