// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const Driver = require("../models/driver");
const status = require("../config/const"); //TODO Rename all constant exports to status 
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
    const carRows = await dbAll(`SELECT * FROM cars WHERE race_id=?`, raceId);
    const cars = carRows.map(row => new Car(row));
    console.log("All Cars int", cars);
    return cars;
}

async function setLapTime(carId) {
    console.log("Gotten car Id", carId);
    setLapNumber(carId);//OK
    let lapTime;
    const previousLapTime = await getPreviousLapTime(carId);// OK
    console.log("The Preivouse lap time is:", previousLapTime.race_elapse_time)
    if (previousLapTime.race_elapse_time === 0) {
        console.log("Setup the first lap start time");
        try {
            await setFirstLapStartTime(carId)
        } catch {
            console.log("error setting the initial start time", err);
        }
        try {
            console.log("Set up the first lap time");
            lapTime = await getCarLapTime(carId);
            console.log("Set up the first lap time", lapTime);
        } catch {
            console.log("error getting the first lap time", err);
        }
        const query = 'UPDATE cars SET current_lap_time = ? where id= ?'
        try {
            await dbRun(query, [lapTime, carId]);
        } catch {
            console.log('Error updating current lap time', err);
        }

    } else {
        console.log("the Previouse lap time IS NOT 0");
        lapTime = await getCarLapTime(carId);
        console.log(lapTime)
        const query = 'UPDATE cars SET current_lap_time = ? where id= ?'
        try {
            await dbRun(query, [lapTime, carId]);
        } catch {
            console.log('Error updating current lap time', err);
        }
        try {
            await setNewLapStartTime(carId);
        } catch {
            console.log('Error setting new lap Start Time', err);
        }
    }
}

async function getPreviousLapTime(carId) {
    console.log("Started to get previous lap time",)
    const previousLapTime = await dbGet('SELECT race_elapse_time FROM cars WHERE id= ?', carId);
    console.log("Started to get previous lap time", previousLapTime.race_elapse_time)
    return previousLapTime;
}

async function setFirstLapStartTime(carId) {
    console.log("setFist Lap start Time for", carId);
    lapStartTime = time.getRaceStartTime();
    console.log("lap start time from race Timer", lapStartTime);
    const query = `UPDATE cars SET race_elapse_time = ? where id= ?`;
    try {
        await dbRun(query, [lapStartTime, carId]);
    } catch (err) {
        console.log('Error updating lap start time', err);
    }
}

async function setNewLapStartTime(carId) {
    lapStartTime = Date.now();
    console.log(lapStartTime);
    console.log("set Lap start Time for", carId);
    const query = 'UPDATE cars SET race_elapse_time = ? where id= ?';
    try {
        await dbRun(query, [lapStartTime, carId]);
    } catch (err) {
        console.log('Error updating lap start time', err);
    }
};

//This should be OK
async function getCarLapTime(carId) {
    const previousLapTime = await getPreviousLapTime(carId);
    console.log("Previous lap time ", previousLapTime);
    let currentTime = Date.now();
    console.log("The time now!", currentTime);
    const newLapTime = currentTime - previousLapTime.race_elapse_time;
    console.log("BEFORE Update Best Lap Time");
    updateBestLapTime(carId, newLapTime);
    return newLapTime;
};

async function getBestLapTime(carId) {
    const query = 'SELECT best_lap_time FROM cars WHERE id = ?'
    try {
        bestLapTime = await dbGet(query, carId);
        console.log('Got the best lap time', bestLapTime.best_lap_time);
    } catch {
        console.log('error getting best time');
    }
    return bestLapTime.best_lap_time;
}

async function setBestLapTime(bestLapTime, carId) {
    const query = 'UPDATE cars SET best_lap_time = ? where id= ?'
    try {
        await dbRun(query, [bestLapTime, carId]);
        console.log('updated Car with id:', carId, 'best time to:', bestLapTime);
    } catch {
        console.log('error updating the lap number', err);
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
    setLapTime,
}
