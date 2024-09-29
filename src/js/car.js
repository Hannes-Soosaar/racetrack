// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const Driver = require("../models/driver");
const status = require("../config/const"); //TODO Rename all constant exports to status 
const db = require("../../config/db.js");
let cars = null;
let carIDs = null;

// The logic for updating cars is hard-coded. Each race has 8 cars always, each car has a slot in the race, so the first in the first
// slot will always have an index of 0. and the eight car will be the car ID with the index of 7 in the carIDs Array.



//TODO: Test the DB connection to create a new Car object.


// // Takes race object and returns an array with all the cars in the race.
async function getCarIdsByRaceId(raceId) {
    carIDs = await dbAll(`SELECT id FROM cars WHERE  race_id=?`,raceId);
    return carIDs;
};

// Get all the carIds form the race and sets the global variable. ! this can be used in the score board.
async function getCarsByRaceId(raceId) {
    console.log("Id's from the race",)
};



// It find the car that in the by the "carNumber" that is the slot number and 
async function setCarLapNumber(byCarNumber) {
    if (carIDs === null) {
        console.error("there is no race")
    }
    let racingCarId = cars[byCarNumber]
    try {

    } catch {
        console.error("unable to set the");
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
}

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
}
