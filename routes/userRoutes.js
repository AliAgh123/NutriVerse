import express from "express";
import { userController } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

userRouter.use(authenticate);

userRouter.get("/profile", userController.getProfile);
userRouter.patch("/macros", userController.updateMacros);
userRouter.post("/diseases", userController.addDisease);
userRouter.delete("/diseases/:diseaseId", userController.removeDisease);
userRouter.post("/allergies", userController.addAllergy);
userRouter.delete("/allergies/:allergyId", userController.removeAllergy);

export default userRouter;
