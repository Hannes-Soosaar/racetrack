const db = require('../../config/db.js');
const Race = require('../models/race.js');
let currentRace = null;

const raceControl = (io, socket) => {
    console.log('Setting up race control');
    currentRace = null
    // Handle starting the race
    socket.on('start-session', async () => {
        if (currentRace != null) {
            try {
                const raceRow = await dbGet(`SELECT * FROM races WHERE id = ?`, [currentRace.id]);

                if (raceRow) {
                    await dbRun(`DELETE FROM races WHERE id = ?`, [currentRace.id]);

                    const driverRows = await dbAll(`SELECT driver_id FROM race_drivers WHERE race_id = ?`, [currentRace.id]);
                    const driverIds = driverRows.map(row => row.driver_id);

                    await dbRun(`DELETE FROM cars WHERE race_id = ?`, [currentRace.id]);
                    await dbRun(`DELETE FROM race_drivers WHERE race_id = ?`, [currentRace.id]);

                    if (driverIds.length > 0) {
                        const deleteDriversQuery = `
                            DELETE FROM drivers WHERE id IN (${driverIds.map(() => '?').join(', ')})`;
                        await dbRun(deleteDriversQuery, driverIds);
                    }

                    const nextRaceRow = await dbGet(`
                        SELECT * FROM races
                        WHERE DATETIME(date || ' ' || time) > CURRENT_TIMESTAMP
                        ORDER BY DATETIME(date || ' ' || time) ASC
                        LIMIT 1`);

                    if (nextRaceRow) {
                        currentRace = new Race(nextRaceRow);
                        (async () => {
                            try {
                                const raceId = currentRace.id
                                const driverInfo = await getDriverDetails(raceId)
                                io.emit('display-race', driverInfo)
                            } catch (err) {
                                console.log('Error:', err)
                            }
                        })()
                        io.emit('trigger-next-race-message')
                    } else {
                        io.emit('race-status', 'No upcoming race found');
                    }
                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            try {
                const nextRaceRow = await dbGet(`
                    SELECT * FROM races
                    WHERE DATETIME(date || ' ' || time) > CURRENT_TIMESTAMP
                    ORDER BY DATETIME(date || ' ' || time) ASC
                    LIMIT 1`);

                if (nextRaceRow) {
                    console.log('Session found');
                    currentRace = new Race(nextRaceRow);
                    (async () => {
                        try {
                            const raceId = currentRace.id
                            const driverInfo = await getDriverDetails(raceId)
                            io.emit('display-race', driverInfo)
                        } catch (err) {
                            console.log('Error:', err)
                        }
                    })()
                    io.emit('trigger-next-race-message')
                } else {
                    io.emit('race-status', 'No upcoming race found');
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    });

    socket.on('start-race', async () => {
        io.emit('race-status', 'Race started');
        io.emit('race-mode', 'Safe');

        await new Promise((resolve) => {
            changeFlag(1);
            io.emit('race-flags-update', 1);
            resolve();
        });

        //get next race and display on next race page
        console.log('Requesting next race status...')
        io.emit('trigger-get-next-race-status')
    });

    socket.on('end-session', () => {
        changeFlag(2);
        io.emit('race-flags-update', 2);
        io.emit('race-status', 'Session ended');
    });

    // Handle changing race mode
    socket.on('change-mode', (mode) => {
        console.log(`Race mode changed to ${mode}`);
        io.emit('race-mode', mode);
        switch (mode) {
            case 'Safe':
                //TODO: add the un-pause
                changeFlag(1);
                io.emit('race-flags-update', 1);
                break;
            case 'Hazard':
                //TODO: add the pause
                changeFlag(5);
                io.emit('race-flags-update', 5);
                break;
            case 'Danger':
                changeFlag(2);
                //TODO: add the pause
                io.emit('race-flags-update', 2);
                break;
            default:
                changeFlag(null);
        }
    });

    socket.on('request-flags-update', () => {
        console.log('Request for flags update received');
        if (currentRace) {
            io.emit('race-flags-update', currentRace.flag);
        }
    });
    //TODO: add the stop timer
    socket.on('end-race', () => {
        console.log('Race ended');
        io.emit('race-status', 'Race ended');
        io.emit('race-mode', 'Finished');
        changeFlag(3);
        io.emit('race-flags-update', 3);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from race control');
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
}

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
}

function changeFlag(flagID) {
    const sql = `UPDATE races SET status = ? WHERE id = ?`;
    db.run(sql, [flagID, currentRace.id], function (err) {
        if (err) {
            console.log(err.message);
        }
    });
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

module.exports = {
    raceControl,
    getDriverDetails,
}