// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const Driver = require("../models/driver");
const status = require("../config/const"); //TODO Rename all constant exports to status 
const { getCarsForRace } = require("../../controllers/carController");
const db = require("../../config/db.js");
let cars = null;
let carIDs = null;

// The logic for updating cars is hard-coded. Each race has 8 cars always, each car has a slot in the race, so the first in the first
// slot will always have an index of 0. and the eight car will be the car ID with the index of 7 in the carIDs Array.



//TODO: Test the DB connection to create a new Car object.


// Takes race object and returns an array with all the cars in the race.
async function getCarIdsByRaceId(raceId) {
    try {
        const rows = await db.all("SELECT id FROM cars WHERE  RaceId=?", [raceId]);
        carIDs = rows.map(row => row.id);
        return carIDs;
    } catch (error) {
        console.error('Error getting carsIDs from race', error);
        return null;
    }
};

// Get all the carIds form the race and sets the global variable. ! this can be used in the score board.
async function getCarsByRaceId(raceId) {
    try {
        const rows = await db.all("SELECT * FROM cars WHERE  RaceId=?", [raceId]);
        cars = rows.map(row => new Car(row));
        return cars;
    } catch (error) {
        console.error('Error getting cars from race', error);
        return null;
    }
};


// It find the car that in the by the "carNumber" that is the slot number and 
async function setCarLapNumber(byCarNumber) {
    if (cars === null) {
        console.error("there is no race")
    }
    let racingCarId = cars[byCarNumber]
    try {

    } catch {
        console.error("unable to set the");
    }

};


async function getCarLapNumberByID(carId) {
    try {

    } catch{
        
    }

    
}

function setCarLapTime(carId, lapTime) {


};

function setBestLapTime(carId, time) {

};

function addDriverToCar(carId, driverId) {


};

function getDriverByCarId(carId) {
    return Driver;
};


//TODO: Find carID's by Car number and RaceID
//TODO: Update lapTime by CarID
//TODO: Get Best LapTime
//TODO: Set Best LapTime

module.exports = {
    getCarsByRaceId,
    getCarIdsByRaceId,
}
