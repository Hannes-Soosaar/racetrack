// TEST TO SEE IF HOW THE CAR CLASS IS CREATED 
const Driver = require("../models/driver");
const status = require("../config/const");


console.log("all the statusess"+ status);

const NewDriver = new Driver(
	1, // ID will not be changed later
	"Peeter",
	"Muhk",
	1, // CAR
	status.ACTIVE // this is not working as intended.
);

console.log(NewDriver);
