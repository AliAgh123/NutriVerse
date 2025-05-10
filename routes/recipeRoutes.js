// routes/recipeRoutes.js
import express from "express";
import { recipeController } from "../controllers/recipeController.js";
import { authenticate } from "../middleware/auth.js";

const recipeRouter = express.Router();

recipeRouter.use(authenticate);

// Optional: use `authenticate` middleware if needed
recipeRouter.get("/search", recipeController.searchRecipes);
recipeRouter.post("/analyze", recipeController.analyzeNutrition);
recipeRouter.get("/foods", recipeController.searchFoods);

export default recipeRouter;
