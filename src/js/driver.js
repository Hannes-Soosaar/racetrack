// TEST TO SEE IF HOW THE CAR CLASS IS CREATED 
const Driver = require("../models/driver");
const status = require("../config/const");

const NewDriver = new Driver(
	1, // ID will not be changed later
	"Peeter",
	"Muhk",
	status.ACTIVE // this is not working as intended.
);

console.log(NewDriver);

//TODO create a new driver from the DB table driver.
