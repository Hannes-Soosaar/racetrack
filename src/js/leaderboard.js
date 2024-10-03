const Car = require('../models/car.js');
const Driver = require("../models/driver");
const car = require('../js/car.js');
const db = require("../../config/db.js");
const time = require("../js/timer.js");

// takes in an array of Cars and sorts it
async function getLeaderboard(raceId) {
    let cars;
    try {
        cars = await car.getCarsByRaceId(raceId)
        
    } catch {
        console.log("error, getting cars ", error);
    };
    return cars;
};

module.exports = {
    getLeaderboard,
};