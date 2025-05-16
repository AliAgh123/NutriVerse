# NutriVerse Backend

The NutriVerse backend is a Node.js and Express.js application designed to support a comprehensive health and nutrition platform. It manages user data, health profiles, ingredient information, and shopping lists, ensuring personalized dietary recommendations.

## 🛠️ Features

- **User Management**: Registration, authentication, and profile handling.
- **Health Profiles**: Track user-specific allergies and diseases.
- **Ingredient Database**: Manage ingredients with associated health considerations.
- **Shopping Lists**: Create and manage shopping lists tailored to user health profiles.
- **Gamification**: Points system to encourage healthy choices.

## 📁 Project Structure

```

NutriVerse/
├── config/                 # Database configuration
├── controllers/            # Route handlers
├── middleware/             # Custom middleware
├── models/                 # Database models
├── routes/                 # API routes
├── services/               # Business logic
├── utils/                  # Utility functions
├── app.js                  # Application entry point
├── db.sql                  # Database schema
├── dummy\_data.sql          # Sample data for testing
├── package.json            # Project metadata and scripts
└── .gitignore              # Files and directories to ignore in Git

````

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **PostgreSQL** (Ensure it's running and accessible)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AliAgh123/NutriVerse.git
   cd NutriVerse

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   > Note: you can contact us to provide you with our .env file because it is a capstone project and not a real life project we can provide you with the .env file
   
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL = your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   EDAMAM_NUTRITION_APP_ID = your_app_id
   EDAMAM_NUTRITION_APP_KEY = your_app_key
   EDAMAM_RECIPE_APP_ID = your_app_id
   EDAMAM_RECIPE_APP_KEY = your_app_key
   EDAMAM_FOOD_APP_ID = your_app_id
   EDAMAM_FOOD_APP_KEY = your_app_key
   ```

5. **Initialize the database**:

   > Note: we have a hosted database project on neon, you can contact us to provide you with access to it
   
   Ensure PostgreSQL is running. Then, execute the SQL scripts to set up the schema and insert dummy data:

   ```bash
   psql -U your_username -d your_database -f db.sql
   psql -U your_username -d your_database -f dummy_data.sql
   ```

7. **Start the server**:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

## 📬 API Endpoints

The backend provides a RESTful API. Below are some of the primary endpoints:

### Authentication

* `POST /api/users/register` – Register a new user
* `POST /api/users/login` – Authenticate a user and receive a JWT

### User Profile

* `GET /api/users/profile` – Retrieve user profile information
* `PATCH /api/users/macros` – Update user macronutrient goals

### Health Management

* `POST /api/users/allergies` – Add an allergy to a user's profile
* `DELETE /api/users/allergies/:id` – Remove an allergy from a user's profile
* `POST /api/users/diseases` – Add a disease to a user's profile
* `DELETE /api/users/diseases/:id` – Remove a disease from a user's profile

### Ingredients

* `GET /api/ingredients` – Retrieve all ingredients
* `POST /api/ingredients` – Add a new ingredient
* `GET /api/ingredients/:id` – Retrieve details of a specific ingredient

### Shopping Lists

* `POST /api/shopping-lists` – Create a new shopping list
* `GET /api/shopping-lists/:id` – Retrieve a specific shopping list
* `POST /api/shopping-lists/:id/ingredients` – Add ingredients to a shopping list

### Points System

* `GET /api/points` – Retrieve user's current points
* `POST /api/points/award` – Award points to a user
* `POST /api/points/deduct` – Deduct points from a user
* `GET /api/points/leaderboard` – Retrieve the leaderboard

> Note: All endpoints require proper authentication via JWT unless specified otherwise.



## 🤝 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License.

