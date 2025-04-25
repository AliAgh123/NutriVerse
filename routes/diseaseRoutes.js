import express from "express";
import { diseaseController } from "../controllers/diseaseController.js";
import { authenticate } from "../middleware/auth.js";

const diseaseRouter = express.Router();

// Public routes
diseaseRouter.get("/", diseaseController.getAllDiseases);
diseaseRouter.get("/search", diseaseController.searchDiseases);
diseaseRouter.get("/:id", diseaseController.getDiseaseDetails);
diseaseRouter.get(
	"/:id/ingredients",
	diseaseController.getRestrictedIngredients
);

// Authenticated routes
diseaseRouter.use(authenticate);
diseaseRouter.post("/", diseaseController.createDisease);
diseaseRouter.put("/:id", diseaseController.updateDisease);
diseaseRouter.delete("/:id", diseaseController.deleteDisease);
diseaseRouter.post(
	"/:diseaseId/ingredients/:ingredientId",
	diseaseController.addRestrictedIngredient
);
diseaseRouter.delete(
	"/:diseaseId/ingredients/:ingredientId",
	diseaseController.removeRestrictedIngredient
);

export default diseaseRouter;
