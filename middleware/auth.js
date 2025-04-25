import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({ message: "Authorization header missing" });
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "Token not provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { userId: decoded.userId };
		next();
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
