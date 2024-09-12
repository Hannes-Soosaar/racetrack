const db = require('../../config/db.js');
const Race = require('../models/race.js');
let currentRace = null
let nextRace = null

module.exports = (io, socket) => {
    console.log('Setting up race control');

    // Handle starting the race
    socket.on('start-session', () => {
        if (currentRace != null) {
            const query = `SELECT * FROM races WHERE id = ?`
            db.get(query, [currentRace.id], (err, row) => {
                if (err) {
                    console.log(err.message)
                    return
                }
                if (row) {
                    const deleteQuery = `DELETE FROM races WHERE id = ?`
                    db.run(deleteQuery, [currentRace.id], (err) => {
                        if (err) {
                            console.log(err.message)
                            return
                        }

                        db.get("SELECT * FROM races WHERE status = '8' LIMIT 1", (err, row) => {
                            if (err) {
                                console.error(err.message);
                                return;
                            }
                            if (row) {
                                console.log('Session found');
                                currentRace = new Race(row);
                                console.log(currentRace);
                                io.emit('display-race', currentRace); // Emit race info to clients
                            } else {
                                io.emit('race-status', 'No upcoming race found');
                            }
                        })
                    })
                } else {
                    console.log('currentRace Not found')
                }
            })
        } else {
            db.get("SELECT * FROM races WHERE status = '8' LIMIT 1", (err, row) => {
                if (err) {
                    console.error(err.message)
                    return
                }
                if (row) {
                    console.log('Session found');
                    currentRace = new Race(row)
                    console.log(currentRace)
                    io.emit('display-race', currentRace)
                } else {
                    io.emit('race-status', 'No upcoming race found')
                }
            })
        }
    });

    socket.on('start-race', () => {
        io.emit('race-status', 'Race started');
        io.emit('race-mode', 'Safe');
        changeFlag(1)
        io.emit('race-flags-update', 1)
    })

    socket.on('end-session', () => {
        //TODO: if this is called, prepare the next session. Set the previous race to inactive in DB, set the next race status to 8, set the next queued race status to 4. 
        io.emit('race-status', 'Session ended')
    })

    // Handle changing race mode
    socket.on('change-mode', (mode) => {
        console.log(`Race mode changed to ${mode}`);
        io.emit('race-mode', mode);
        switch (mode) {
            case 'Safe':
                changeFlag(1)
                io.emit('race-flags-update', 1)
                break
            case 'Hazard':
                changeFlag(5)
                io.emit('race-flags-update', 5)
                break
            case 'Danger':
                changeFlag(2)
                io.emit('race-flags-update', 2)
                break
            default:
                changeFlag(null)
        }
    });

    socket.on('request-flags-update', () => {
        console.log('Request for flags update received');
        if (currentRace) {
            io.emit('race-flags-update', currentRace.flag)
        }
    })

    // Handle ending the race
    socket.on('end-race', () => {
        console.log('Race ended');
        io.emit('race-status', 'Race ended');
        io.emit('race-mode', 'Finished');
        changeFlag(3)
        io.emit('race-flags-update', 3)
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected from race control');
    });
};



function changeFlag(flagID) {
    const sql = `UPDATE races SET flag = ? WHERE id = ?`
    db.run(sql, [flagID, currentRace.id], function (err) {
        if (err) {
            return console.log(err.message)
        }
    })
}
