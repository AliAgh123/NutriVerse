import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.NODE_ENV === "production"
			? {
					rejectUnauthorized: false,
			  }
			: false,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

const testConnection = async () => {
	try {
		await pool.query("SELECT NOW()");
		console.log("Database connected successfully");
	} catch (err) {
		console.error("Database connection error:", err.message);
		throw err;
	}
};

export { pool, testConnection };
