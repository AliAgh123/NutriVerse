import { User } from "../models/User.js";
import { UserDisease } from "../models/UserDisease.js";
import { UserAllergy } from "../models/UserAllergy.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to exclude sensitive fields
const sanitizeUser = (user) => {
	if (!user) return null;
	const { password, ...userWithoutPassword } = user;
	return userWithoutPassword;
};

export const userController = {
	// Register a new user
	register: async (req, res) => {
		try {
			const { email, password } = req.body;

			// Check if user already exists
			const existingUser = await User.findByEmail(email);
			if (existingUser) {
				return res.status(409).json({ message: "Email already in use" });
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 12);

			// Create user
			const newUser = await User.create({
				email,
				password: hashedPassword,
			});

			// Generate JWT token
			const token = jwt.sign(
				{ userId: newUser.userid },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);

			res.status(201).json({
				user: sanitizeUser(newUser),
				token,
			});
		} catch (error) {
			console.error("Registration error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// User login
	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			// Find user
			const user = await User.findByEmail(email);
			if (!user) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			// Verify password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

			// Generate JWT token
			const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			res.json({
				user: sanitizeUser(user),
				token,
			});
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Get current user profile
	getProfile: async (req, res) => {
		try {
			const user = await User.findById(req.user.userId);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Get user's health data
			const diseases = await UserDisease.getUserDiseases(user.userid);
			const allergies = await UserAllergy.getUserAllergies(user.userid);

			res.json({
				...sanitizeUser(user),
				diseases,
				allergies,
			});
		} catch (error) {
			console.error("Get profile error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Update user macros (fats, proteins, carbs)
	updateMacros: async (req, res) => {
		try {
			const { fats, proteins, carbs } = req.body;
			const updatedUser = await User.updateMacros(req.user.userId, {
				fats,
				proteins,
				carbs,
			});

			res.json(sanitizeUser(updatedUser));
		} catch (error) {
			console.error("Update macros error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Add disease to user
	addDisease: async (req, res) => {
		try {
			const { diseaseId } = req.body;
			await UserDisease.addDiseaseToUser(req.user.userId, diseaseId);
			res.status(204).end();
		} catch (error) {
			console.error("Add disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Remove disease from user
	removeDisease: async (req, res) => {
		try {
			const { diseaseId } = req.params;
			await UserDisease.removeDiseaseFromUser(req.user.userId, diseaseId);
			res.status(204).end();
		} catch (error) {
			console.error("Remove disease error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Add allergy to user
	addAllergy: async (req, res) => {
		try {
			const { allergyId } = req.body;
			await UserAllergy.addAllergyToUser(req.user.userId, allergyId);
			res.status(204).end();
		} catch (error) {
			console.error("Add allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	// Remove allergy from user
	removeAllergy: async (req, res) => {
		try {
			const { allergyId } = req.params;
			await UserAllergy.removeAllergyFromUser(req.user.userId, allergyId);
			res.status(204).end();
		} catch (error) {
			console.error("Remove allergy error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
	getUserPoints: async (req, res) => {
		try {
			const points = await PointsService.getCurrentPoints(req.user.userId);
			res.json({ points });
		} catch (error) {
			console.error("Get user points error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	awardPoints: async (req, res) => {
		try {
			const { activityType } = req.body;
			const updatedUser = await PointsService.awardPoints(
				req.user.userId,
				activityType
			);
			res.json({
				points: updatedUser.points,
				message: `Points awarded for ${activityType}`,
			});
		} catch (error) {
			console.error("Award points error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	deductPoints: async (req, res) => {
		try {
			const { points } = req.body;
			if (!points || points <= 0) {
				return res.status(400).json({ message: "Valid points value required" });
			}

			const updatedUser = await PointsService.deductPoints(
				req.user.userId,
				points
			);
			res.json({
				points: updatedUser.points,
				message: `${points} points deducted`,
			});
		} catch (error) {
			console.error("Deduct points error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	getLeaderboard: async (req, res) => {
		try {
			const { limit = 10 } = req.query;
			const { rows: leaders } = await User.query(
				`SELECT userId, email, points 
			 FROM Users 
			 ORDER BY points DESC 
			 LIMIT $1`,
				[limit]
			);
			res.json(leaders);
		} catch (error) {
			console.error("Get leaderboard error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
};
