const db = require('../../config/db.js');
const { getDriverDetails } = require('./race-control.js')

module.exports = (io, socket) => {
    socket.on('get-next-race-status', async () => {
        console.log('get-next-race-status event triggered')
        try {
            const nextRaceData = await getNextRace()
            io.emit('update-next-race', nextRaceData)
        } catch (err) {
            console.log('Error getting next race status:', err)
            io.emit('update-next-race', null)
        }
    })
}

async function getNextRace() {
    try {
        const racesQuery = `
            SELECT * FROM races
            WHERE DATETIME(date || ' ' || time) > CURRENT_TIMESTAMP
            AND status = 'upcoming'
            ORDER BY DATETIME(date || ' ' || time) ASC
            LIMIT 1
        `;

        const nextRace = await new Promise((resolve, reject) => {
            db.get(racesQuery, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (nextRace) {
            const raceId = nextRace.id;
            const drivers = await getDriverDetails(raceId);

            return {
                race: nextRace,
                drivers: drivers
            };
        } else {
            console.log('No upcoming races found.');
            return null;
        }

    } catch (err) {
        console.log('Error fetching races:', err);
        return null;
    }
}



