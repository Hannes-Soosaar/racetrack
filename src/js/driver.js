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


// The Input and Event needs to give the following info: Car, Driver details and RaceId
// Creates a driver and returns the ID that was created so it could be added to the slot
function createNewDriver(name, lastName, status) {
	return driverId;
}
