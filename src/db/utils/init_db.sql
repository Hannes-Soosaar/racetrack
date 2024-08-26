CREATE TABLE IF NOT EXISTS drivers(
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    car_id INTEGER,
    status INTEGER,
)

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
    status INTEGER,
)

CREATE  TABLE IF NOT EXISTS races(
    id INTEGER PRIMARY KEY,
    car_id INTEGER,
    driver_id INTEGER,
-- can be  1-racing(safe), 2 - waiting  3-inactive  4 -safe  5- Next  6 -Danger 7 -Finish Safety Official can change 
-- check the 
    status INTEGER, 
)


-- each driver gets a result that is tied to the race
CREAT TABLE IF NOT EXISTS race_results (
    id INTEGER PRIMARY KEY,
    driver_id INTEGER,
    race_id INTEGER,
    palace INTEGER, -- might not be needed
    time NUMBER
)