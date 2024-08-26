const Race = require("../models/race");
const status = require("../config/const");

const NewRace = new Race(
	1, // ID will not be changed later
	1, // car ID 
	1, // driver ID
	1, // CAR
	status.ACTIVE // this is not working as intended.
);

console.log(NewRace);
