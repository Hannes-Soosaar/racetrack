// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const Driver = require("../models/driver");
const status = require("../config/const"); //TODO Rename all constant exports to status 
const db = require("../../config/db.js");
const time = require("../js/timer.js");
const { QueryTypes } = require("sequelize");
let carIDs = null;


// The logic for updating cars is hard-coded. Each race has 8 cars always, each car has a slot in the race, so the first in the first
// slot will always have an index of 0. and the eight car will be the car ID with the index of 7 in the carIDs Array.

// // Takes race object and returns an array with all the cars in the race.
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
};

// updates the raceTimer and updates the individual timer on the car.
async function setLapCompleted(byCarNumber) {

    remainingRaceTime = time.G
    if (carIDs === null) {
        console.error("there is no race/carId's")
    }
    try {

    } catch {
        console.error("unable to set the");
    }
};

// ? Will be using race_elapsed_time temp.
//! store start time here

async function getPreviousLapTime(carId){
    const previousLapTime= await dbGet('SELECT race_elapse_time FROM cars WHERE id= ?', carId);
    return previousLapTime;
}


async function setLapStartTime(carId){
    const previousLapTime = await getPreviousLapTime(carId);
    if ( previousLapTime === 0 ){
        lapStartTime = time.getRaceStartTime();
    } else {
        lapStartTime = Date.now();
    }
    const query = 'UPDATE cars SET race_elapse_time = ? where id= ?';
    try{
        await dbRun(query, lapStartTime, carId);
    } catch (err){
        console.log('Error updating lap start time',err);
    }
    setLapTime(carId);
}

//This should be OK
async function getCarLapTime(carId){
    const previousLapTime = await getPreviousLapTime(carId);
    const newLapTime = previousLapTime- Date.now();
    return newLapTime;
}


async function setLapTime(carId){
    const lapTime= await getCarLapTime(carId);
    const query = 'UPDATE cars SET current_lap_time = ? where id= ?'
    try{
        await dbRun(query,lapTime, query);
    }catch{
        console.log('Error updating current lap time', err);
    }
}


// This should be OK
async function setLapNumber(carId){
    const query = 'UPDATE cars SET race_lap = race_lap+1 where id= ?';
    try{
        await dbRun(query, carId);
        console.log("lap number increased for car ID", carId);
    }catch(err){
        console.log(' Error updating the lap number');
    }
}
    


function getCarIdByCarNumber(carNumber) {
    if (carIDs === null) {
        console.error("there is no race/carId's");
        return "error no carIDs set";
    } else {
        return carIDs[carNumber];
    }
}

async function setBestLap(carId, LapTime) {

}

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
