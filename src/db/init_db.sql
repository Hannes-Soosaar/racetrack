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
    name TEXT, -- Optional: if you want to give cars a name
    number INTEGER NOT NULL, -- Car number specific to the race (e.g., 1-8)
    race_id INTEGER, -- Foreign key linking this car to a specific race
    race_lap INTEGER DEFAULT 0, -- Track the number of laps
    current_lap_time NUMBER DEFAULT 0.0, -- Current lap time for the car
    best_lap_time NUMBER DEFAULT 0.0, -- Best lap time for the car
    race_elapse_time NUMBER DEFAULT 0.0, -- Total elapsed race time
    status INTEGER, -- Car status (active, finished, etc.)
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL, -- Set driver_id to NULL if the driver is deleted
    FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE -- Ensure the car is tied to a specific race
);


-- This table is updated -- the car ID's must be unique 
-- CREATE TABLE IF NOT EXISTS races (
--     id INTEGER PRIMARY KEY,
--     created NUMBER,
--     car_1_id INTEGER,
--     car_2_id INTEGER,
--     car_3_id INTEGER,
--     car_4_id INTEGER,
--     car_5_id INTEGER,
--     car_6_id INTEGER,
--     car_7_id INTEGER,
--     car_8_id INTEGER,
--     status INTEGER,
--     FOREIGN KEY (car_1_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_2_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_3_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_4_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_5_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_6_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_7_id) REFERENCES cars(id) ON DELETE SET NULL,
--     FOREIGN KEY (car_8_id) REFERENCES cars(id) ON DELETE SET NULL
-- );

-- add a car to a slot
-- CREATE TABLE IF NOT EXISTS races_test (
--     id INTEGER PRIMARY KEY,
--     created NUMBER,
--     slot_1_id INTEGER,
--     slot_2_id INTEGER,
--     slot_3_id INTEGER,
--     slot_4_id INTEGER,
--     slot_5_id INTEGER,
--     slot_6_id INTEGER,
--     slot_7_id INTEGER,
--     slot_8_id INTEGER,
--     status INTEGER,
--     flag INTEGER   --split the flags to this integer
-- );


CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_name TEXT,         -- Optional, if you want to name races
    date TEXT NOT NULL,        -- Date of the race (e.g., "2024-09-12")
    time TEXT NOT NULL,        -- Time of the race (e.g., "14:00")
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


