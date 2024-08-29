-- Clears tables
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS race_slots;
DROP TABLE IF EXISTS race_results;

--Define and build tables
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    status INTEGER
);
-- Add demo driver
INSERT INTO drivers (first_name,last_name,status) VALUES
('Hannes','Man',8),
('Peppa','Pig',8),
('Peeter','Sky',8),
('Olli','Sea',8),
('Mari','Kari',8),
('Tiit','Kask',8),
('Teet','Kala',8),
('Paul','Mari',8);

-- the car is main data carrier. Each race will have unique Car/slot ID's
CREATE TABLE IF NOT EXISTS cars(
    id INTEGER PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    name TEXT,
    number INTEGER,
    race_lap INTEGER,
    current_lap_time NUMBER,
    best_lap_time NUMBER,
    race_elapse_time NUMBER,
    status INTEGER
);
-- add demo cars
INSERT INTO cars (driver_id, name, number,race_lap,current_lap_time,best_lap_time,race_elapse_time,status) VALUES
(1,'one',01,0,0,0,0,8),
(2,'two',02,0,0,0,0,8),
(3,'three',03,0,0,0,0,8),
(4,'four',04,0,0,0,0,8),
(5,'five',05,0,0,0,0,8),
(6,'six',06,0,0,0,0,8),
(7,'seven',07,0,0,0,0,8),
(8,'eight',08,0,0,0,0,8);

-- This table is updated -- the car ID's must be unique 
CREATE  TABLE IF NOT EXISTS races(
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
    status INTEGER
);

-- add demo race
INSERT INTO races (created,car_1_id,car_2_id,car_3_id,car_4_id,car_5_id,car_6_id,car_7_id,car_8_id,status) VALUES
(08272024,1,2,3,4,5,6,7,8,8);

INSERT INTO races (created,car_1_id,car_2_id,car_3_id,car_4_id,car_5_id,car_6_id,car_7_id,car_8_id,status) VALUES
(08272025,8,7,6,5,4,3,2,1,8);

-- each race has 8 slots each with a driver and a car
--NOT NEEDED
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
--     palace INTEGER, -- might not be needed
--     time NUMBER
-- );