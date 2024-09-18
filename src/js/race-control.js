const db = require('../../config/db.js');
const Race = require('../models/race.js');
let currentRace = null;

module.exports = (io, socket) => {
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
                        console.log('Session found');
                        currentRace = new Race(nextRaceRow);
                        io.emit('display-race', currentRace); // Emit race info to clients
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
                    io.emit('display-race', currentRace);
                } else {
                    io.emit('race-status', 'No upcoming race found');
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    });

    socket.on('start-race', () => {
        io.emit('race-status', 'Race started');
        io.emit('race-mode', 'Safe');
        changeFlag(1);
        io.emit('race-flags-update', 1);
    });

    socket.on('end-session', () => {
        io.emit('race-status', 'Session ended');
    });

    // Handle changing race mode
    socket.on('change-mode', (mode) => {
        console.log(`Race mode changed to ${mode}`);
        io.emit('race-mode', mode);
        switch (mode) {
            case 'Safe':
                changeFlag(1);
                io.emit('race-flags-update', 1);
                break;
            case 'Hazard':
                changeFlag(5);
                io.emit('race-flags-update', 5);
                break;
            case 'Danger':
                changeFlag(2);
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
