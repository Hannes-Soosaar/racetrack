const db = require('../../config/db.js')
const Race = require('../models/race.js')
const { dbGet } = require('./race-control.js')

module.exports = (io, socket) => {
    socket.on('get-flag-status', async () => {
        try {
            const row = await dbGet("SELECT * FROM races WHERE status != 'upcoming' LIMIT 1")

            if (row) {
                const currentRace = new Race(row)
                const statusInt = parseInt(currentRace.status, 10)
                io.emit('race-flags-update', statusInt)
            } else {
                console.log('No race ongoing!')
            }
        } catch (err) {
            console.error(err.message)
        }
    });
}