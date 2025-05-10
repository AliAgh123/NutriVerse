import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const EDAMAM_NUTRITION_APP_ID = process.env.EDAMAM_NUTRITION_APP_ID;
const EDAMAM_NUTRITION_APP_KEY = process.env.EDAMAM_NUTRITION_APP_KEY;
const EDAMAM_RECIPE_APP_ID = process.env.EDAMAM_RECIPE_APP_ID;
const EDAMAM_RECIPE_APP_KEY = process.env.EDAMAM_RECIPE_APP_KEY;
const EDAMAM_FOOD_APP_ID = process.env.EDAMAM_FOOD_APP_ID;
const EDAMAM_FOOD_APP_KEY = process.env.EDAMAM_FOOD_APP_KEY;

class EdamamService {
	// NUTRITION ANALYSIS API
	static async analyzeNutrition(ingredients) {
		try {
			const response = await axios.post(
				"https://api.edamam.com/api/nutrition-details",
				{
					title: "Nutrition Analysis",
					ingr: ingredients,
					url: "", // Optional recipe URL
					summary: "", // Optional summary
				},
				{
					params: {
						app_id: EDAMAM_NUTRITION_APP_ID,
						app_key: EDAMAM_NUTRITION_APP_KEY,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error(
				"Nutrition analysis error:",
				error.response?.data || error.message
			);
			throw new Error("Failed to analyze nutrition");
		}
	}

	// RECIPE SEARCH API
	static async searchRecipes({ query, health, diet, calories }) {
		try {
			const params = {
				type: "public",
				q: query,
				app_id: EDAMAM_RECIPE_APP_ID,
				app_key: EDAMAM_RECIPE_APP_KEY,
				from: 0,
				to: 10, // Limit results
			};

			if (health) params.health = health;
			if (diet) params.diet = diet;
			if (calories) params.calories = calories;

			const response = await axios.get(
				"https://api.edamam.com/api/recipes/v2",
				{ params }
			);
			return response.data.hits.map((hit) => ({
				uri: hit.recipe.uri,
				label: hit.recipe.label,
				image: hit.recipe.image,
				calories: hit.recipe.calories,
				ingredients: hit.recipe.ingredientLines,
				healthLabels: hit.recipe.healthLabels,
				dietLabels: hit.recipe.dietLabels,
				nutrients: hit.recipe.totalNutrients,
			}));
		} catch (error) {
			console.error(
				"Recipe search error:",
				error.response?.data || error.message
			);
			throw new Error("Failed to search recipes");
		}
	}

	// FOOD DATABASE API
	static async searchFoodItems(query, category = "generic-foods") {
		try {
			const response = await axios.get(
				"https://api.edamam.com/api/food-database/v2/parser",
				{
					params: {
						ingr: query,
						app_id: EDAMAM_FOOD_APP_ID,
						app_key: EDAMAM_FOOD_APP_KEY,
						category: category,
					},
				}
			);
			return response.data.hints.map((hint) => ({
				foodId: hint.food.foodId,
				label: hint.food.label,
				nutrients: hint.food.nutrients,
				category: hint.food.category,
				image: hint.food.image,
			}));
		} catch (error) {
			console.error(
				"Food search error:",
				error.response?.data || error.message
			);
			throw new Error("Failed to search food items");
		}
	}
}

export default EdamamService;
