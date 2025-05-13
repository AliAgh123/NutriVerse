import express from "express";
import { shoppingListController } from "../controllers/shoppingListController.js";
import { authenticate } from "../middleware/auth.js";

const shoppingListRouter = express.Router();

shoppingListRouter.use(authenticate);

shoppingListRouter.post("/", shoppingListController.createList);
shoppingListRouter.get("/", shoppingListController.getUserLists);
shoppingListRouter.get("/:id", shoppingListController.getListDetails);
shoppingListRouter.delete("/:id", shoppingListController.deleteList);

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

shoppingListRouter.post(
	"/generate/smart",
	shoppingListController.generateSmartList
);

shoppingListRouter.post(
	"/from-edamam",
	authenticate,
	shoppingListController.fromEdamam
);

export default shoppingListRouter;
