-- User Table
CREATE TABLE Users (
    userId SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fats NUMERIC(10, 2),
    proteins NUMERIC(10, 2),
    carbs NUMERIC(10, 2)
);

-- Disease Table
CREATE TABLE Disease (
    diseaseId SERIAL PRIMARY KEY,
    diseaseName VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Allergies Table
CREATE TABLE Allergies (
    allergyId SERIAL PRIMARY KEY,
    allergyName VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Ingredient Table
CREATE TABLE Ingredient (
    ingredientId SERIAL PRIMARY KEY,
    ingredientName VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- ShoppingList Table
CREATE TABLE ShoppingList (
    shoppingListId SERIAL PRIMARY KEY,
    userId INT REFERENCES Users(userId) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Disease Relationship Table
CREATE TABLE UserDisease (
    userId INT REFERENCES Users(userId) ON DELETE CASCADE,
    diseaseId INT REFERENCES Disease(diseaseId) ON DELETE CASCADE,
    PRIMARY KEY (userId, diseaseId)
);

-- User-Allergy Relationship Table
CREATE TABLE UserAllergy (
    userId INT REFERENCES Users(userId) ON DELETE CASCADE,
    allergyId INT REFERENCES Allergies(allergyId) ON DELETE CASCADE,
    PRIMARY KEY (userId, allergyId)
);

-- ShoppingList-Ingredient Relationship Table
CREATE TABLE ShoppingListIngredient (
    shoppingListId INT REFERENCES ShoppingList(shoppingListId) ON DELETE CASCADE,
    ingredientId INT REFERENCES Ingredient(ingredientId) ON DELETE CASCADE,
    quantity NUMERIC(10, 2),
    PRIMARY KEY (shoppingListId, ingredientId)
);

-- Ingredient-Allergy Relationship Table
CREATE TABLE IngredientAllergy (
    ingredientId INT REFERENCES Ingredient(ingredientId) ON DELETE CASCADE,
    allergyId INT REFERENCES Allergies(allergyId) ON DELETE CASCADE,
    PRIMARY KEY (ingredientId, allergyId)
);

-- Ingredient-Disease Relationship Table
CREATE TABLE IngredientDisease (
    ingredientId INT REFERENCES Ingredient(ingredientId) ON DELETE CASCADE,
    diseaseId INT REFERENCES Disease(diseaseId) ON DELETE CASCADE,
    PRIMARY KEY (ingredientId, diseaseId)
);
