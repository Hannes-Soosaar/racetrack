const db = require('../../config/db.js');
const Race = require('../models/race.js');

module.exports = (io, socket) => {
    console.log('Setting up race control');

    // Handle starting the race
    socket.on('start-race', () => {
        db.get("SELECT * FROM races WHERE status = '8' LIMIT 1", (err, row) => {
            if (err) {
                console.error(err.message)
                return
            }

            if (row) {
                console.log('Race started');
                const race = new Race(row)
                console.log(race)
                io.emit('race-status', 'Race started');
                io.emit('race-mode', 'Safe'); // Assuming the race starts in 'Safe' mode
            } else {
                io.emit('race-status', 'No upcoming race found')
            }
        })
    });

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