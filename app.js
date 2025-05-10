import express from "express";
import cors from "cors";
import { pool, testConnection } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import allergyRouter from "./routes/allergyRoutes.js";
import ingredientRouter from "./routes/ingredientRoutes.js";
import diseaseRouter from "./routes/diseaseRoutes.js";
import shoppingListRouter from "./routes/shoppingListRoutes.js";
import pointsRouter from "./routes/pointsRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("NutriVerse server is running");
});

app.get("/health", async (req, res) => {
	try {
		await pool.query("SELECT NOW()");
		res.status(200).json({
			status: "healthy",
			database: "connected",
			timestamp: new Date(),
		});
	} catch (err) {
		res.status(500).json({
			status: "unhealthy",
			database: "disconnected",
			error: err.message,
		});
	}
});

app.use("/api/users", userRouter);
app.use("/api/allergies", allergyRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/diseases", diseaseRouter);
app.use("/api/shoppingLists", shoppingListRouter);
app.use("/api/points", pointsRouter);
app.use("/api/recipes", recipeRouter);

app.listen(port, () => console.log("Server started on PORT: " + port));
