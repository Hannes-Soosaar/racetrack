const Race = require("../models/race");
const status = require("../config/const");
const Car = require("../models/car");


const NewRace = new Race(
	1, // ID
	1, // created
	1, // CAR 1
	2, // CAR
	3, // CAR
	4, // CAR
	5, // CAR
	6, // CAR
	7, // CAR
	8, // CAR
	status.ACTIVE
);
console.log(NewRace);

//TODO: try to get the demo race from the DB.

//TODO: 
// finds the race by the status and returns a race object
function getRaceIdByStatus(raceStatus) {
	return raceID;
}

// takes in a race object returns a sorted array with cars. 
//? Do we need anything else here like the duration to be returned?
function getRaceResults(race) {
	result = `sport Wins!`
	return result;
}

//return a flag (number) that is gotten from the db.
function getRacesFlag() {
	return status.SAFE
}

//Sets the Race Status
function setRaceStatusByRaceId(raceId){

}

function setRaceFlagByRaceId(raceId){

}

// Adds a car by Id to a race Slot from 
function setCarToRaceSlotBySlotId(RaceId,carId,slotId) {
	return success;
}

//! not needed the slot content should update when the car is updated
function updateRaceSlotBySlotId(RaceId,SlotId){
	//Add car to slot if empty
	return success;
}
