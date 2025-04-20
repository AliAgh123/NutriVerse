import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/user", (req, res) => {
	res.send({
		name: "Ali Abdel Ghaffar",
		password: "password",
	});
});

app.get("/", (req, res) => {
	res.send("API working");
});

app.listen(port, () => console.log("Server started on PORT: " + port));
