
-- Insert dummy data into Users
INSERT INTO Users (email, password, fats, proteins, carbs) VALUES
('alice@example.com', 'password123', 70.5, 50.2, 120.0),
('bob@example.com', 'secret456', 80.0, 60.1, 100.3),
('carol@example.com', 'mypassword', 60.4, 45.3, 110.2);

-- Insert dummy data into Disease
INSERT INTO Disease (diseaseName, description) VALUES
('Diabetes', 'A disease that affects blood sugar levels.'),
('Hypertension', 'High blood pressure condition.'),
('Celiac', 'An immune reaction to eating gluten.');

-- Insert dummy data into Allergies
INSERT INTO Allergies (allergyName, description) VALUES
('Peanuts', 'Allergy to peanuts.'),
('Dairy', 'Lactose intolerance.'),
('Shellfish', 'Reaction to shellfish.');

-- Insert dummy data into Ingredient
INSERT INTO Ingredient (ingredientName, description) VALUES
('Tomato', 'Red vegetable used in salads.'),
('Chicken', 'Protein-rich meat.'),
('Milk', 'Dairy product.');

-- Insert dummy data into ShoppingList
INSERT INTO ShoppingList (userId, created_at, updated_at) VALUES
(1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert dummy data into UserDisease
INSERT INTO UserDisease (userId, diseaseId) VALUES
(1, 1),
(2, 2),
(3, 3);
