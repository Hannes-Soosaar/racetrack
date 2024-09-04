-- Clears tables
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS race_slots;
DROP TABLE IF EXISTS race_results;

-- Define and build tables
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    carNumber INTEGER,
    status INTEGER,
    createdAt TEXT,  -- Removed NOT NULL
    updatedAt TEXT   -- Removed NOT NULL
);

-- Cars table: the car is the main data carrier.
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY,
    driver_id INTEGER, -- Allow this to be NULL so a car can exist without a driver
    name TEXT,
    number INTEGER UNIQUE, -- Ensure car numbers are unique
    race_lap INTEGER DEFAULT 0,
    current_lap_time NUMBER DEFAULT 0.0,
    best_lap_time NUMBER DEFAULT 0.0,
    race_elapse_time NUMBER DEFAULT 0.0,
    status INTEGER,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL -- Set driver_id to NULL if the driver is deleted
);

-- Races table: define race sessions (removed duplicate definition)
CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_date TEXT,  -- The date of the race session
    status TEXT DEFAULT 'upcoming',  -- Status: 'upcoming', 'in-progress', 'completed'
    created_at TEXT,
    updated_at TEXT
);

-- Race slots: assign drivers and cars to specific race sessions
CREATE TABLE IF NOT EXISTS race_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id INTEGER,  -- The race session ID
    driver_id INTEGER,  -- The driver ID
    car_number INTEGER,  -- The car number
    FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Insert 8 cars into the cars table
INSERT INTO cars (name, number, status) VALUES 
('Car One', 1, 1), 
('Car Two', 2, 1),
('Car Three', 3, 1),
('Car Four', 4, 1),
('Car Five', 5, 1),
('Car Six', 6, 1),
('Car Seven', 7, 1),
('Car Eight', 8, 1);
