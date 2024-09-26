
//? This should only hold the logic that calls out functions

const db = require("../../config/db.js");
const Race = require("../models/race.js");
const participants = require("../js/car.js")
let raceId = null;


// test function
function addLapToCarByCarId(carId){
    newValue += value;
    return newValue
}

function startedRace(io, raceId) {
    console.log('the race', raceId, 'has started');
    participants.getCarsByRaceId(raceId);
    //TODO: Get Race data  Active Race
    //TODO: Get data from the car.
}




function endRace() {
    raceId = null;
}


// Before update check if race is active.
//TODO: Check if race is active.


module.exports = {
    endRace,
    startedRace,
    raceId
};