const car = require('../js/car.js')
const driver = require('../js/driver.js')


async function setDriverIdToCars(raceId) {
    console.log('Starting To set drivers to Race id:',raceId);
    let carIdsAndNumbers;
    let driverIdsAndCarNumbers;
    carIdsAndNumbers = await car.getCarIdsAndCarNumbers(raceId);
    driverIdsAndCarNumbers = await driver.getDriverIdsAndCarNumbers(raceId);
    for (let carInfo of carIdsAndNumbers) {
        for (let driverInfo of driverIdsAndCarNumbers) {
            if (carInfo.number === driverInfo.car_number) {
                await car.setDriverId(driverInfo.driver_id, carInfo.id);
                let driverName = await driver.getDriverName(driverInfo.driver_id);
                await car.setDriverName(carInfo.id,driverName);
            }
        }
    };
}

module.exports = {
    setDriverIdToCars,
}