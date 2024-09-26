const db = require('../../config/db.js');
const Race = require('../models/race.js');

module.exports = (io, socket) => {
    socket.on('get-flag-status', () => {
        db.get("SELECT * FROM races WHERE status != 'upcoming' LIMIT 1", (err, row) => {
            if (err) {
                console.error(err.message)
                return
            }
            if (row) {
                const currentRace = new Race(row)
                const statusInt = parseInt(currentRace.status, 10)
                io.emit('race-flags-update', statusInt)
            } else {
                console.log('No race ongoing!')
            }
        })
    })
}