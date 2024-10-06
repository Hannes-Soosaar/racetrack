const RaceDiver = require("../models/race_drivers.js");
const db = require("../../config/db.js");

// it will get all driver IDs and organize the 
async function getDriverByRaceId(raceId){
    let driversIds;
    const query = 'SELECT driver_id FROM race_driver WHERE race_id =? ';
    try{
        driversIds = await dbAll(query,raceId);
    }catch{
        console.log('Error getting driver Ids for the race');
    }
    return driversIds;
} 

// Need to give in CarsWithNumbers, raceId and DriverId\s
async function setDriverForRace(driversIds, raceId){
    const query = 'UPDATA cars '

}

//TODO: for each car loop over the drivers object and if there is there is a driver with the matching carNumber add the driver first Name and Last name to the Car object Name.
//TODO: Get carid and number based on raceid return carsWithNumbers
//TODO: Get driverid and carnumber based on raceid
//TODO: set DriverId for a car if carnumbers match
//TODO: Get driver first_name and last_name wher driver_id retrun driver name.
//TODO: set Driver name for carId.

//returns the car number from the drivers
async function getCarNumberForDriver(driverId){

    const query='';
    try{

    }catch{
        console.log('Error getting car numbers for drivers');
    }
}


async function a(){

};

async function setDriverIdByCarId(driverId, carId) {

    
};


async function setNameToCar(){

};

// this section could be imported

async function dbRun(query, params) {
    console.log(" the query and parameters are ", query, params);
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

async function dbGet(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

async function dbAll(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {
    gerDriversByRaceId,
}