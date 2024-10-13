const db = require('../../config/db.js');
const Race = require('../models/race.js');
const status = require('../config/const.js')
const race = require('../js/race.js');
const car = require("../js/car.js");

let currentRace = null;
let raceID = null;
let flag = null;
// The order of the races that will be taken is the the earliest first that is not in the past.

const raceControl = (io, socket) => {
    console.log('Setting up race control');
    // currentRace = null
    // Handle starting the race
    socket.on('start-session', async () => {
        if (currentRace != null) {
            try {
                const nextRaceRow = await dbGet(`
                    SELECT * FROM races
                    WHERE DATETIME(date || ' ' || time) > CURRENT_TIMESTAMP
                    AND status = 'upcoming'
                    ORDER BY DATETIME(date || ' ' || time) ASC
                    LIMIT 1`);
                if (nextRaceRow) {
                    io.emit('race-flags-update', status.DANGER);
                    console.log("HERE, with a race!");
                    currentRace = new Race(nextRaceRow);
                    race.setDriverIdToCars(currentRace.id);
                    (async () => {
                        try {
                            const raceId = currentRace.id
                            raceID = raceId;
                            io.emit('block-driver-changes', (raceId))
                            io.emit('block-driver-addition', (raceId)) // Block adding drivers as well
                            const driverInfo = await getDriverDetails(raceId)
                            io.emit('display-race', driverInfo)
                            io.emit('race-status', 'Race not started')
                        } catch (err) {
                            console.log('Error:', err)
                        }
                    })()
                    io.emit('trigger-next-race-message')
                } else {
                    io.emit('race-status', 'No upcoming race found');
                    currentRace = null
                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            try {
                const nextRaceRow = await dbGet(`
                    SELECT * FROM races
                    WHERE DATETIME(date || ' ' || time) > CURRENT_TIMESTAMP
                    AND status = 'upcoming'
                    ORDER BY DATETIME(date || ' ' || time) ASC
                    LIMIT 1`);
                if (nextRaceRow) {
                    io.emit('race-flags-update', status.DANGER);
                    console.log('Session found');
                    currentRace = new Race(nextRaceRow);
                    (async () => {
                        try {
                            const raceId = currentRace.id
                            raceID = currentRace.id;
                            console.log("HERE, with else!");
                            race.setDriverIdToCars(raceID)
                            io.emit('block-driver-changes', (raceId))
                            io.emit('block-driver-addition', (raceId)) // Block adding drivers as well
                            const driverInfo = await getDriverDetails(raceId)
                            io.emit('display-race', driverInfo)
                            io.emit('race-status', 'Race not started')
                        } catch (err) {
                            console.log('Error:', err)
                        }
                    })()
                    io.emit('trigger-next-race-message')
                } else {
                    io.emit('race-status', 'No upcoming race found');
                    currentRace = null
                }
            } catch (err) {
                console.error(err.message);
            }
        }
        if (currentRace != null && currentRace.id !== null) {
            io.emit('load-leader-board', currentRace.id);
        } else {
            io.emit('load-no-race');
        }
    });

    socket.on('start-race', async () => {
        const raceRow = await dbGet(`SELECT * FROM races WHERE status = ?`, [3]);
        if (raceRow) {
            await dbRun(`DELETE FROM races WHERE id = ?`, [raceRow.id]);
            const driverRows = await dbAll(`SELECT driver_id FROM race_drivers WHERE race_id = ?`, [raceRow.id]);
            // const racingCarIds = await dbAll(`SELECT id FROM cars WHERE  race_id=?`, [currentRace.id]);
            // console.log("the participant carIDs are", racingCarIds);
            const driverIds = driverRows.map(row => row.driver_id);
            await dbRun(`DELETE FROM cars WHERE race_id = ?`, [raceRow.id]);
            await dbRun(`DELETE FROM race_drivers WHERE race_id = ?`, [raceRow.id]);
            if (driverIds.length > 0) {
                const deleteDriversQuery = `
                            DELETE FROM drivers WHERE id IN (${driverIds.map(() => '?').join(', ')})`;
                await dbRun(deleteDriversQuery, driverIds);
            }
        }

        io.emit('race-status', 'Race started');
        io.emit('race-mode', 'Safe');
        io.emit('set-raceId', raceID);
        // Emit an event to disable adding drivers to this race
        io.emit('block-driver-addition', raceID);
        const cars = await car.getCarsByRaceId(raceID);
        io.emit('update-leader-board', cars);
        await new Promise((resolve) => {
            changeFlag(1);
            io.emit('race-flags-update', status.SAFE);
            flag = status.SAFE;
            resolve();
        });
        // Notify all clients that the race has started
        io.emit('race-status-updated', { raceId: raceID, status: 'started' });
        console.log('Requesting next race status...');
        io.emit('trigger-get-next-race-status');
    });

    socket.on('end-session', () => {
        changeFlag(3);
        io.emit('set-raceId', raceID);
        raceID = null;
        io.emit('race-flags-update', 3);
        flag = 3;
        io.emit('race-status', 'Session ended');
    });

    socket.on('get-session', async () => {
        io.emit('set-raceId', raceID);
        const cars = await car.getCarsByRaceId(raceID);
        io.emit('update-leader-board', cars);
        console.log(currentRace);
        if (flag !== null) {
            io.emit('race-flags-update', flag);
        }
    });

    // Handle changing race mode 
    socket.on('change-mode', (mode) => {
        console.log(`Race mode changed to ${mode}`);
        io.emit('race-mode', mode);
        switch (mode) {
            case 'Safe':
                changeFlag(status.SAFE);
                io.emit('race-flags-update', status.SAFE);
                io.emit('resume-timer');
                flag = status.SAFE;
                break;
            case 'Hazard':
                changeFlag(status.HAZARD);
                io.emit('race-flags-update', status.HAZARD);
                flag = status.HAZARD;
                io.emit('pause-timer');
                break;
            case 'Danger':
                changeFlag(status.DANGER);
                io.emit('pause-timer');
                io.emit('race-flags-update', status.DANGER);
                flag = status.HAZARD;
                break;
        }
    });

    socket.on('request-flags-update', () => {
        console.log('Request for flags update received');
        if (currentRace) {
            io.emit('race-flags-update', currentRace.flag);
        }
    });

    socket.on('end-race', () => {
        raceID = null;
        console.log('Race ended');
        io.emit('race-status', 'Race ended');
        io.emit('race-mode', 'Finished');
        changeFlag(status.FINISHED);
        io.emit('race-flags-update', status.FINISHED);
        flag = status.FINISHED;
        flag = null;
        io.emit('stop-timer');
        io.emit('set-raceId', raceID);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from race control');
    });
};

function changeFlag(flagID) {
    if (currentRace && currentRace.id) {
        const sql = `UPDATE races SET status = ? WHERE id = ?`;
        db.run(sql, [flagID, currentRace.id], function (err) {
            if (err) {
                console.log(err.message);
            }
        });
    } else {
        console.log("No active race to update the flag.");
    }
}


async function getDriverDetails(raceId) {
    const query = `
    SELECT 
        (drivers.first_name || ' ' || drivers.last_name) AS driver_name,
        race_drivers.car_number
    FROM race_drivers
    JOIN drivers ON race_drivers.driver_id = drivers.id
    WHERE race_drivers.race_id = ?
    `
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(query, [raceId], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
        return rows
    } catch (err) {
        console.log('Error fetching driver details:', err)
    }
}

// DB functions!
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
}

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

async function dbRun(query, params) {
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

module.exports = {
    raceControl,
    getDriverDetails,
    dbGet,
    dbRun,
} 