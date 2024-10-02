const { response } = require('express');
const db = require('../config/db');

// Generate new cars for a race
exports.createCarsForRace = (raceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const carInsertQuery = `INSERT INTO cars (number, race_id, name) VALUES (?, ?, ?)`;

            for (let i = 1; i <= 8; i++) {  // Assuming 8 cars per race
                await new Promise((resolve, reject) => {
                    db.run(carInsertQuery, [i, raceId, `Car ${i}`], function (err) {
                        if (err) {
                            console.error(`Error creating car ${i} for race ${raceId}:`, err);
                            return reject(err);
                        }
                        console.log(`Car ${i} created for race ${raceId}`);
                        resolve();
                    });
                });
            }
            resolve();  // All cars created successfully
        } catch (err) {
            reject(new Error('Error creating cars for race'));
        }
    });
};


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




