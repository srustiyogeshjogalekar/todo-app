-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    plan VARCHAR(50),
    status VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    img VARCHAR(10)
);

-- Create Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    sets INTEGER,
    reps INTEGER,
    difficulty VARCHAR(20),
    calories INTEGER,
    timing VARCHAR(50),
    image VARCHAR(10)
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    type VARCHAR(50),
    flavor VARCHAR(100),
    price INTEGER,
    discount INTEGER,
    rating DECIMAL(2,1),
    stock INTEGER,
    timing VARCHAR(100),
    quantity VARCHAR(50),
    benefits TEXT,
    image VARCHAR(10)
);

-- Create Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    fiber INTEGER,
    water VARCHAR(50),
    timing VARCHAR(50)
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100),
    message TEXT,
    time VARCHAR(20),
    read BOOLEAN DEFAULT FALSE,
    type VARCHAR(20)
);

-- Seed Data (Optional)
INSERT INTO users (name, username, email, phone, plan, status, join_date, expiry_date, img) VALUES
('Alex Rivera', 'alexr', 'alex@ai.com', '+1 234 567 890', 'Premium', 'Active', '2026-02-12', '2027-02-12', '👤'),
('Sarah Connor', 'sarahc', 'sarah@ai.com', '+1 987 654 321', 'Basic', 'Pending', '2026-05-01', '2027-05-01', '👤'),
('Marcus Wright', 'marcusw', 'marcus@ai.com', '+1 555 000 111', 'Standard', 'Blocked', '2025-11-20', '2026-11-20', '👤')
ON CONFLICT (email) DO NOTHING;

INSERT INTO exercises (name, category, sets, reps, difficulty, calories, timing, image) VALUES
('Neural Bench Press', 'Strength', 4, 10, 'Expert', 180, '45m', '🏋️‍♂️'),
('Cyber Cardio Sprints', 'Cardio', 1, 15, 'Intermediate', 350, '20m', '🏃‍♂️');

INSERT INTO products (name, brand, type, flavor, price, discount, rating, stock, timing, quantity, benefits, image) VALUES
('Vortex Whey Protein', 'AlphaLabs', 'Protein', 'Chocolate Silicon', 5000, 20, 4.8, 15, 'Post Workout', '2kg', 'Muscle Recovery & Growth', '🧪'),
('Alpha Mass Gainer', 'CyberBulk', 'Mass Gainer', 'Vanilla Velocity', 6000, 15, 4.5, 10, 'Post Workout', '5kg', 'Weight Gain & Size', '📦');

INSERT INTO food_items (name, calories, protein, carbs, fat, fiber, water, timing) VALUES
('Chicken Breast', 165, 31, 0, 3.6, 0, '250ml', 'Lunch'),
('Eggs (Boiled)', 155, 13, 1.1, 11, 0, '200ml', 'Breakfast');
