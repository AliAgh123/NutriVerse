import express from "express";
import { allergyController } from "../controllers/allergyController.js";
import { authenticate } from "../middleware/auth.js";

const allergyRouter = express.Router();

allergyRouter.get("/", allergyController.getAllAllergies);
allergyRouter.get("/:id", allergyController.getAllergyDetails);

allergyRouter.use(authenticate);
allergyRouter.post("/", allergyController.createAllergy);
allergyRouter.post("/user", allergyController.addUserAllergy);
allergyRouter.get("/user/mine", allergyController.getUserAllergies);
allergyRouter.delete("/user/:allergyId", allergyController.removeUserAllergy);
allergyRouter.post(
	"/:allergyId/ingredients/:ingredientId",
	allergyController.addHarmfulIngredient
);

export default allergyRouter;
