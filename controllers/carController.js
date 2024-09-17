const db = require('../config/db');

// Generate new cars for a race
exports.createCarsForRace = (raceId) => {
    const carInsertQuery = `INSERT INTO cars (number, race_id, name) VALUES (?, ?, ?)`;
    for (let i = 1; i <= 8; i++) {  // Assuming 8 cars per race
        db.run(carInsertQuery, [i, raceId, `Car ${i}`], function(err) {
            if (err) {
                console.error(`Error creating car ${i} for race ${raceId}:`, err);
            } else {
                console.log(`Car ${i} created for race ${raceId}`);
            }
        });
    }
};




// Get available cars for a race
exports.getCarsForRace = (req, res) => {
    const { raceId } = req.params;
    const query = `SELECT * FROM cars WHERE race_id = ?`;
    
    console.log('Fetching cars for race ID:', raceId);
    db.all(query, [raceId], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve cars' });
        }
        console.log('Cars fetched:', rows);  // Log fetched cars to verify
        res.status(200).json(rows);
    });
};


