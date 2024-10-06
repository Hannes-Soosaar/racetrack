-- Clears tables
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS race_slots;
DROP TABLE IF EXISTS race_results;
DROP TABLE IF EXISTS race_drivers;

--Define and build tables
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    status INTEGER,
    createdAt TEXT,  -- Removed NOT NULL
    updatedAt TEXT   -- Removed NOT NULL
);

-- the car is the main data carrier. Each race will have unique Car/slot ID's
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER, -- Allow this to be NULL so a car can exist without a driver
    race_id INTEGER, -- Foreign key linking this car to a specific race
    driver_name TEXT, -- Optional: if you want to give cars a name
    number INTEGER NOT NULL, -- Car number specific to the race (e.g., 1-8)
    race_lap INTEGER DEFAULT 0, -- Track the number of laps
    current_lap_time NUMBER DEFAULT 0.0, -- Current lap time for the car
    best_lap_time NUMBER DEFAULT 0.0, -- Best lap time for the car
    --! this is not a car atribute should move to the race.
    race_elapse_time NUMBER DEFAULT 0.0, -- Total elapsed race time 
    status INTEGER, -- Car status (active, finished, etc.)
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL, -- Set driver_id to NULL if the driver is deleted
    FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE -- Ensure the car is tied to a specific race
);

CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_name TEXT,         -- Optional, if you want to name races
    date TEXT NOT NULL,        -- Date of the race (e.g., "2024-09-12") HS: this is not needed.
    time TEXT NOT NULL,        -- Time of the race (e.g., "14:00") : this should contain the remaining time of the race.
    duration INTEGER DEFAULT -1,        -- Keep track of what the race duration. starts with -1 as default.
    status TEXT DEFAULT 'upcoming'  -- Tracks the race status (upcoming, active, finished)
);

CREATE TABLE IF NOT EXISTS race_drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id INTEGER,  -- Foreign key to the races table
    driver_id INTEGER,  -- Foreign key to the drivers table
    car_number INTEGER,  -- Car number assigned to the driver for this race
    FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    UNIQUE (race_id, car_number)  -- Ensure car assignment is unique within a race
);