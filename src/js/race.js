const Race = require("../models/race");
const status = require("../config/const");
const Car = require("../models/car");
const db = require('../config/db');  // this uses the establised connection 

//TODO: try to get the demo race from the DB.

// finds the race by the status and returns a race object
function getRaceIdByStatus(raceStatus) {
	db.get('SELECT id FROM race_test WHERE status=?', raceStatus, (err, raceID) => {
		if (err) {
			console.log(`There is an error with the query`);
		} else {
			console.log(`The Race ID is: ` + raceID);
			return raceID;
		}
	});
}


// Returns the race object
function getRaceByRaceId(raceId) {
	db.get("SELECT * FROM race_test WHERE  id=?", raceID, (err, row) => {
		if (err) {
			console.log(`Somethings up with the db or query`)
		} else {
			console.log('The result is' + row)
			const race = new Race(row);
			return race;
		}
	});
}

//return a flag (number) that is gotten from the db.
function getRacesFlagByRaceID(raceID) {
	db.get('SELECT flag FROM race_test WHERE id=?', raceID, (err, flag) => {
		if (err) {
		} else {
			console.log(`The flag is: ` + flag);
			return flag
		}
	});
}


//Sets the Race Status
function setRaceStatusByRaceId(raceId) {

}

// sets/update the Race timer
function setRaceCreatedByRaceId(raceId){

}

function setRaceFlagByRaceId(raceId) {

}

// Adds a car by Id to a race Slot from 
function setCarToRaceSlotBySlotId(RaceId, carId, slotId) {
	return success;
}

//! not needed the slot content should update when the car is updated
function updateRaceSlotBySlotId(RaceId, SlotId) {
	//Add car to slot if empty
	return success;
}


///TEST 