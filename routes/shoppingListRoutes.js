import express from "express";
import { shoppingListController } from "../controllers/shoppingListController.js";
import { authenticate } from "../middleware/auth.js";

const shoppingListRouter = express.Router();

// All routes require authentication
shoppingListRouter.use(authenticate);

// Basic CRUD operations
shoppingListRouter.post("/", shoppingListController.createList);
shoppingListRouter.get("/", shoppingListController.getUserLists);
shoppingListRouter.get("/:id", shoppingListController.getListDetails);
shoppingListRouter.delete("/:id", shoppingListController.deleteList);

// Ingredient management
shoppingListRouter.post(
	"/:id/ingredients",
	shoppingListController.addIngredientToList
);
shoppingListRouter.delete(
	"/:id/ingredients/:ingredientId",
	shoppingListController.removeIngredientFromList
);
shoppingListRouter.patch(
	"/:id/ingredients/:ingredientId",
	shoppingListController.updateIngredientQuantity
);

// Smart features
shoppingListRouter.post(
	"/generate/smart",
	shoppingListController.generateSmartList
);

export default shoppingListRouter;
