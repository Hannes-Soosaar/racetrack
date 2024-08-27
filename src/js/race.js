const Race = require("../models/race");
const status = require("../config/const");

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
