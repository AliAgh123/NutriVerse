import express from "express";
import { authenticate } from "../middleware/auth.js";
import { userController } from "../controllers/userController.js";

const pointsRouter = express.Router();

pointsRouter.use(authenticate);

pointsRouter.get("/", userController.getUserPoints);
pointsRouter.post("/award", userController.awardPoints);
pointsRouter.post("/deduct", userController.deductPoints);
pointsRouter.get("/leaderboard", userController.getLeaderboard);

export default pointsRouter;
