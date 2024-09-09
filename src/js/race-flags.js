const db = require('../../config/db.js');
const Race = require('../models/race.js');

module.exports = (io, socket) => {
    socket.on('get-flag-status', () => {
        db.get("SELECT * FROM races WHERE status = '4' LIMIT 1", (err, row) => {
            if (err) {
                console.error(err.message)
                return
            }
            if (row) {
                currentRace = new Race(row)
                io.emit('race-flags-update', currentRace.flag)
            } else {
                console.log('No race ongoing!')
            }
        })
    })
}