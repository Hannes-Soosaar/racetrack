const { response } = require('express');
const db = require('../config/db');

// Generate new cars for a race
exports.createCarsForRace = async (raceId) => {
    const carInsertQuery = `INSERT INTO cars (number, race_id, name) VALUES (?, ?, ?)`;
    for (let i = 1; i <= 8; i++) {  // Assuming 8 cars per race
        console.log(" this is the car added i", i);
        await new Promise((resolve, reject) => {
            db.run(carInsertQuery, [i, raceId, `Car ${i}`], function (err) {
                if (err) {
                    console.error(`Error creating car ${i} for race ${raceId}:`, err);
                    reject(err);
                } else {
                    console.log(`Car ${i} created for race ${raceId}`);
                    resolve();
                }
            });
        });
    }
}


exports.getCarsForRace = (req, res) => {
    const { raceId } = req.params;
    const query = `SELECT * FROM cars WHERE race_id = ? AND driver_id IS NULL`;  // Fetch unassigned cars

    db.all(query, [raceId], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve cars' });
        }
        console.log('Available cars:', rows);  // Debugging: log available cars
        res.status(200).json(rows);  // Send the cars to the client
    });
};




