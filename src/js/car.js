const Car = require("../models/car");
const status = require("../config/const");
const db = require("../../config/db.js");
const time = require("../js/timer.js");
let carIDs = null;

// The logic for updating cars is hard-coded. Each race has 8 cars always, each car has a slot in the race, so the first in the first
// slot will always have an index of 0. and the eight car will be the car ID with the index of 7 in the carIDs Array.

async function getCarIdsByRaceId(raceId) {
    carIDs = await dbAll(`SELECT id FROM cars WHERE  race_id=?`, raceId);
    return carIDs;
};

// Get all the carIds form the race and sets the global variable. ! this can be used in the score board.
async function getCarsByRaceId(raceId) {
    const query = `
        SELECT * 
        FROM cars 
        WHERE race_id = ? 
        AND driver_id IS NOT NULL 
        ORDER BY 
            CASE 
                WHEN best_lap_time = 0 THEN 1
                ELSE 0
            END, 
            best_lap_time ASC
    `;
    const carRows = await dbAll(query, [raceId]);
    const cars = carRows.map(row => new Car(row));
    for (let car of cars) {
        car.race_elapse_time = time.displayMinutesAndSeconds(car.race_elapse_time);
    }
    return cars;
}

async function setLapTime(carId) {
    setLapNumber(carId);//OK
    let lapTime;
    const previousLapTime = await getPreviousLapTime(carId);// OK
    if (previousLapTime.race_elapse_time === 0) {
        console.log("Setup the first lap start time");
        try {
            await setFirstLapStartTime(carId)
        } catch (error) {
            console.log("error setting the initial start time", error);
        }
        try {
            lapTime = await getCarLapTime(carId);
        } catch (error) {
            console.log('error getting car lap time', error);
        }
        const query = 'UPDATE cars SET current_lap_time = ? where id= ?'
        try {
            await dbRun(query, [lapTime, carId]);
        } catch (error) {
            console.log('Error updating current lap time', error);
        }
    } else {
        lapTime = await getCarLapTime(carId);
        const query = 'UPDATE cars SET current_lap_time = ? where id= ?'
        try {
            await dbRun(query, [lapTime, carId]);
        } catch (error) {
            console.log('Error updating current lap time', error);
        }
        try {
            await setNewLapStartTime(carId);
        } catch (error) {
            console.log('Error setting new lap Start Time', error);
        }
    }
}

async function getPreviousLapTime(carId) {
    const previousLapTime = await dbGet('SELECT race_elapse_time FROM cars WHERE id= ?', carId);
    return previousLapTime;
}

async function setFirstLapStartTime(carId) {
    lapStartTime = time.getRaceStartTime();
    const query = `UPDATE cars SET race_elapse_time = ? where id= ?`;
    try {
        await dbRun(query, [lapStartTime, carId]);
    } catch (error) {
        console.log('Error updating lap start time', error);
    }
}

async function setNewLapStartTime(carId) {
    lapStartTime = Date.now();
    const query = 'UPDATE cars SET race_elapse_time = ? where id= ?';
    try {
        await dbRun(query, [lapStartTime, carId]);
    } catch (error) {
        console.log('Error updating lap start time', error);
    }
};

async function getCarLapTime(carId) {
    const previousLapTime = await getPreviousLapTime(carId);
    let currentTime = Date.now();
    const newLapTime = currentTime - previousLapTime.race_elapse_time;
    updateBestLapTime(carId, newLapTime);
    return newLapTime;
};

async function getBestLapTime(carId) {
    const query = 'SELECT best_lap_time FROM cars WHERE id = ?'
    try {
        bestLapTime = await dbGet(query, carId);
    } catch (error) {
        console.log('error getting best time', error);
    }
    return bestLapTime.best_lap_time;
}

async function setBestLapTime(bestLapTime, carId) {
    const query = 'UPDATE cars SET best_lap_time = ? where id= ?'
    try {
        await dbRun(query, [bestLapTime, carId]);
    } catch (error) {
        console.log('error updating the lap number', error);
    }
}

async function getCarIdsAndCarNumbers(raceId) {
    const query = 'SELECT id,number FROM cars WHERE race_id=?'
    let carIdsAndNumbers;
    try {
        carIdsAndNumbers = await dbAll(query, [raceId]);
        return carIdsAndNumbers
    } catch (error) {
        console.log('error getting car id and number ', error);
        return null;
    }
}

async function getDriverId(carId) {
    const query = 'SELECT driver_if FROM cars WHERE id=?'
    let driverId;
    try {
        driverId = await dbGet(query, [driverName, carId]);
    } catch (error) {
        console.log('error getting driver Id', error);
    }
}

async function setDriverName(carId, driverName) {
    const query = 'UPDATE cars SET driver_name = ? WHERE id = ?'
    try {
        await dbRun(query, [driverName, carId]);
    } catch (error) {
        console.log('error', error, 'Updating cars table car id', carId, 'with driverName', driverName)
    }
}

async function setDriverId(driverId, carId) {
    const query = 'UPDATE cars SET driver_id = ? WHERE id =?'
    try {
        await dbRun(query, [driverId, carId]);
    } catch (error) {
        console.log('error', error, 'Updating cars table car id', carId, 'with driver Id', driverId);
    }
}

async function updateBestLapTime(carId, lapTime) {
    const bestLapTime = await getBestLapTime(carId);
    if (lapTime < bestLapTime || bestLapTime === 0) {
        await setBestLapTime(lapTime, carId);
    }
}

async function setLapNumber(carId) {
    const query = 'UPDATE cars SET race_lap = race_lap+1 where id= ?';
    try {
        await dbRun(query, [carId]);
        console.log('lap number increased for car ID', carId);
    } catch (err) {
        console.log('error updating the lap number', err);
    }
};

async function dbGet(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

async function dbAll(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

async function dbRun(query, params) {
    console.log(" the query and parameters are ", query, params);
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

module.exports = {
    getCarsByRaceId,
    getCarIdsByRaceId,
    getCarIdsAndCarNumbers,
    getDriverId,
    setDriverName,
    setDriverId,
    setLapTime,
    dbAll,
    dbRun,
    dbGet,
}