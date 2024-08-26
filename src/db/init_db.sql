-- Clears tables
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS race_slots;
DROP TABLE IF EXISTS race_results;
--builds tables
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    car_id INTEGER,
    status INTEGER
);

CREATE TABLE IF NOT EXISTS cars(
    id INTEGER PRIMARY KEY,
    name TEXT,
    number INTEGER,
-- the lap we are on
    race_lap INTEGER,
-- might want to use a time format here.
    current_lap_time NUMBER,
    best_lap_time NUMBER,
    race_elapse_time NUMBER,
-- can be 1 racing, 2 waiting , 3 inactive 
    status INTEGER
);

-- This table is updated
CREATE  TABLE IF NOT EXISTS races(
    id INTEGER PRIMARY KEY,
    slot_1_id INTEGER,
    slot_2_id INTEGER,
    slot_3_id INTEGER,
    slot_4_id INTEGER,
    slot_5_id INTEGER,
    slot_6_id INTEGER,
    slot_7_id INTEGER,
    slot_8_id INTEGER,
    status INTEGER
);

-- each race has 8 slots each with a driver and a car
CREATE TABLE IF NOT EXISTS race_slots (
    id INTEGER PRIMARY KEY,
    car_id INTEGER,
    driver_id INTEGER,
    -- do we need this? 
    race_id  INTEGER,
    -- can active or closed.
    status INTEGER
);

-- each driver gets a result that is tied to the race
CREATE TABLE IF NOT EXISTS race_results (
    id INTEGER PRIMARY KEY,
    driver_id INTEGER,
    race_id INTEGER,
    palace INTEGER, -- might not be needed
    time NUMBER
);