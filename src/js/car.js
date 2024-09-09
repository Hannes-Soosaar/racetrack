// TEST TO SEE IF HOW THE  CLASS IS CREATED
// WORKS AS INTENDED

const Car = require("../models/car");
const Driver = require("../models/driver");
const status = require("../config/const");

const myCar = new Car(1, 1, "one", 1, 123.45, 120.0, 500.0,10, status.ACTIVE);

console.log(myCar);


//TODO: Test the DB connection to create a new Car object.


// Takes race object and returns an array with all the cars in the race.
function getCarById(carId){
    db.get("SELECT * FROM cars WHERE  id=?", carId, (err, row) => {
        if (err) {
            console.log(`Somethings up with the db or query`)
        } else {
            console.log('The result is' + row)
            const car = new Car(row);
            return car;
        }
    });
}

function setCarLapNumber(carId){

}

function setCarLapTime(carId){
    

}

function addDriverToCar(carId, driverId){


}

function getDriverByCarId(carId){
    return Driver;
}

// This will require some thinking. a new car can only be created on an emptySlot?
function createNewCar(diverId,carNumber,status){

    create
    return carId;
}


