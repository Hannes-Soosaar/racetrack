// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const status = require("../config/const");

const myCar = new Car(1, 1, "one", 1, 123.45, 120.0, 500.0,10, status.ACTIVE);

console.log(myCar);


//TODO: Test the DB connection to create a new Car object.