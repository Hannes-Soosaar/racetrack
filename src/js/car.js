// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const status = require("../config/const");

const myCar = new Car(
	1,
	"Thunder F",
	5,
	10,
	123.45,
	120.0,
	500.0,
	status.FINISHED
);

console.log(myCar);
