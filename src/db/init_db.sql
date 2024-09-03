-- Clears tables
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS race_slots;
DROP TABLE IF EXISTS race_results;

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

-- This table is updated -- the car ID's must be unique 
CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY,
    created NUMBER,
    car_1_id INTEGER,
    car_2_id INTEGER,
    car_3_id INTEGER,
    car_4_id INTEGER,
    car_5_id INTEGER,
    car_6_id INTEGER,
    car_7_id INTEGER,
    car_8_id INTEGER,
    status INTEGER,
    FOREIGN KEY (car_1_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_2_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_3_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_4_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_5_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_6_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_7_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (car_8_id) REFERENCES cars(id) ON DELETE SET NULL
);

INSERT INTO cars (name, number, status) VALUES ('Car One', 1, 1), ('Car Two', 2, 1);

-- each race has 8 slots each with a driver and a car
-- NOT NEEDED

-- CREATE TABLE IF NOT EXISTS race_slots (
--     id INTEGER PRIMARY KEY,
--     car_id INTEGER,
--     driver_id INTEGER,
--     -- do we need this? 
--     race_id  INTEGER,
--     -- can active or closed.
--     status INTEGER
-- );

-- each driver gets a result that is tied to the race
-- the result will be an ordered race.

-- CREATE TABLE IF NOT EXISTS race_results (
--     id INTEGER PRIMARY KEY,
--     driver_id INTEGER,
--     race_id INTEGER,
--     place INTEGER, -- might not be needed
--     time NUMBER
-- );
