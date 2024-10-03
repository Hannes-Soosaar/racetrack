
//? This should only hold the logic that calls out functions

const db = require("../../config/db.js");
const participants = require("../js/car.js")
let raceId = null;


function startedRace(raceId) {
    console.log('the race', raceId, 'has started');
    participants.getCarsByRaceId(raceId);
}

function endRace() {
    raceId = null;
}

module.exports = {
    endRace,
    startedRace,
};