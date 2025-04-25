import { User } from "../models/User.js";

class PointsService {
	static async awardPoints(userId, activityType) {
		const pointsMap = {
			RECIPE_COMPLETED: 10,
			SHOPPING_LIST_CREATED: 5,
			HEALTH_GOAL_MET: 20,
			COMMUNITY_CONTRIBUTION: 15,
			DAILY_LOGIN: 1,
		};

		const points = pointsMap[activityType] || 0;
		if (points <= 0) return null;

		return await User.awardPoints(userId, points);
	}

	static async deductPoints(userId, points) {
		if (points <= 0) throw new Error("Points must be positive");
		return await User.deductPoints(userId, points);
	}

	static async getCurrentPoints(userId) {
		const user = await User.getUserWithPoints(userId);
		return user ? user.points : 0;
	}
}

export default PointsService;
