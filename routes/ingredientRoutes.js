import express from "express";
import { ingredientController } from "../controllers/ingredientController.js";
import { authenticate } from "../middleware/auth.js";

const ingredientRouter = express.Router();

// Public routes
ingredientRouter.get("/", ingredientController.getAllIngredients);
ingredientRouter.get("/search", ingredientController.searchIngredients);
ingredientRouter.get("/popular", ingredientController.getPopularIngredients);
ingredientRouter.get("/:id", ingredientController.getIngredientDetails);

// Authenticated routes
ingredientRouter.use(authenticate);
ingredientRouter.post("/", ingredientController.createIngredient);
ingredientRouter.post(
	"/:ingredientId/allergies/:allergyId",
	ingredientController.addIngredientAllergy
);
ingredientRouter.delete(
	"/:ingredientId/allergies/:allergyId",
	ingredientController.removeIngredientAllergy
);
// NEW routes
ingredientRouter.post(
	"/:ingredientId/diseases/:diseaseId",
	ingredientController.addIngredientDisease
);
ingredientRouter.delete(
	"/:ingredientId/diseases/:diseaseId",
	ingredientController.removeIngredientDisease
);

export default ingredientRouter;
