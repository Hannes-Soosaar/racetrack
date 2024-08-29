const db = require('../../config/db.js');
const Race = require('../models/race.js');

module.exports = (io, socket) => {
    console.log('Setting up race control');

    // Handle starting the race
    socket.on('start-session', () => {
        db.get("SELECT * FROM races WHERE status = '8' LIMIT 1", (err, row) => {
            if (err) {
                console.error(err.message)
                return
            }

            if (row) {
                console.log('Session found');
                const race = new Race(row)
                console.log(race)
                io.emit('display-race', race)
            } else {
                io.emit('race-status', 'No upcoming race found')
            }
        })
    });

    socket.on('start-race', () => {
        io.emit('race-status', 'Race started');
        io.emit('race-mode', 'Safe');
    })

    socket.on('end-session', () => {
        //TODO: if this is called, prepare the next session. Set the previous race to inactive in DB, set the next race status to 8, set the next queued race status to 4. 
    })

    // Handle changing race mode
    socket.on('change-mode', (mode) => {
        console.log(`Race mode changed to ${mode}`);
        io.emit('race-mode', mode);
    });

    // Handle ending the race
    socket.on('end-race', () => {
        console.log('Race ended');
        io.emit('race-status', 'Race ended');
        io.emit('race-mode', 'Finished');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected from race control');
    });
};