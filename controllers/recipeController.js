import EdamamService from "../services/edamamService.js";

export const recipeController = {
	searchRecipes: async (req, res) => {
		try {
			const { q, health, diet, calories } = req.query;
			if (!q) {
				return res
					.status(400)
					.json({ message: "Query parameter 'q' is required" });
			}

			const recipes = await EdamamService.searchRecipes({
				query: q,
				health,
				diet,
				calories,
			});
			res.json(recipes);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	analyzeNutrition: async (req, res) => {
		try {
			const { ingredients } = req.body;
			if (!ingredients || !Array.isArray(ingredients)) {
				return res
					.status(400)
					.json({ message: "An array of ingredients is required" });
			}

			const nutrition = await EdamamService.analyzeNutrition(ingredients);
			res.json(nutrition);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	searchFoods: async (req, res) => {
		try {
			const { q, category } = req.query;
			if (!q) {
				return res
					.status(400)
					.json({ message: "Query parameter 'q' is required" });
			}

			const foods = await EdamamService.searchFoodItems(q, category);
			res.json(foods);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};
