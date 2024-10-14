const RaceDiver = require("../models/race_drivers.js");
const db = require("../../config/db.js");

async function getDriverIdsAndCarNumbers(raceId) {
    const query = 'SELECT driver_id, car_number FROM race_drivers WHERE race_id =?';
    let driverIdsAndCarNumbers;
    try {
        driverIdsAndCarNumbers = await dbAll(query, raceId);
        return driverIdsAndCarNumbers;
    } catch (error) {
        console.log('Error getting driverIds and car numbers', error);
        return null;
    };
}

async function getDriverName(driverId) { 
    const query = 'SELECT first_name, last_name FROM drivers WHERE  id = ?'
    let driverNames;
    try {
        driverNames = await dbGet(query, driverId);
    } catch (error) {
        console.log('error getting driver names for driver id', error);
        return null;
    }
    const driverName = driverNames.first_name + ' ' + driverNames.last_name;
    return driverName
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
    getDriverIdsAndCarNumbers,
    getDriverName
}