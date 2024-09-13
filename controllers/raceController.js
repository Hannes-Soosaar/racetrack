const db = require('../config/db');
const carController = require('./carController');

// Create a new race session and generate cars
exports.createRaceSession = (req, res) => {
    const { session_name, date, time, status } = req.body;
    const query = `INSERT INTO races (session_name, date, time, status) VALUES (?, ?, ?, ?)`;

    db.run(query, [session_name, date, time, status], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not create race session', details: err });
        }

        const raceId = this.lastID;
        carController.createCarsForRace(raceId);  // Generate 8 virtual cars for the race
        res.status(201).json({ id: raceId, session_name, date, time, status });
    });
};



// Get all race sessions
exports.getRaceSessions = (req, res) => {
    const query = `SELECT * FROM races`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Could not retrieve races', details: err });
        }
        res.status(200).json(rows);
    });
};

// Update a race session
exports.updateRaceSession = (req, res) => {
    const { id } = req.params;
    const { session_name, date, time, status } = req.body;
    const query = `UPDATE races SET session_name = ?, date = ?, time = ?, status = ? WHERE id = ?`;

    db.run(query, [session_name, date, time, status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not update race', details: err });
        }
        res.status(200).json({ message: 'Race updated successfully' });
    });
};

// Delete a race session
exports.deleteRaceSession = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM races WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not delete race', details: err });
        }
        res.status(200).json({ message: 'Race deleted successfully' });
    });
};

// Add a driver to a race
exports.addDriverToRace = (req, res) => {
    const { id } = req.params;  // The race session ID
    const { firstName, lastName, carNumber } = req.body;

    const checkCarNumberQuery = `SELECT COUNT(*) AS count FROM race_drivers WHERE race_id = ? AND car_number = ?`;
    db.get(checkCarNumberQuery, [id, carNumber], function(err, row) {
        if (err) {
            return res.status(500).json({ error: 'Could not verify car number', details: err });
        }
        
        if (row.count > 0) {
            return res.status(400).json({ error: `Car number ${carNumber} is already assigned in this race.` });
        }

        // Proceed to add the driver if the car number is not already in use
        const insertDriverQuery = `INSERT INTO drivers (first_name, last_name) VALUES (?, ?)`;

        db.run(insertDriverQuery, [firstName, lastName], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Could not add driver', details: err });
            }

            const driverId = this.lastID;  // Get the last inserted driver ID
            const insertRaceDriverQuery = `INSERT INTO race_drivers (race_id, driver_id, car_number) VALUES (?, ?, ?)`;

            db.run(insertRaceDriverQuery, [id, driverId, carNumber], function(err) {
                if (err) {
                    console.error('Error in adding driver to race:', err);
                    return res.status(500).json({ error: 'Could not assign driver to race', details: err });
                }

                res.status(201).json({ message: 'Driver added to race successfully' });
            });
        });
    });
};



// Get all drivers for a specific race
exports.getDriversForRace = (req, res) => {
    const { id } = req.params;  // The race session ID

    const query = `SELECT d.first_name, d.last_name, rd.car_number
                   FROM race_drivers rd
                   JOIN drivers d ON rd.driver_id = d.id
                   WHERE rd.race_id = ?`;

    db.all(query, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve drivers for this race', details: err });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No drivers found for this race' });
        }

        res.status(200).json(rows);
    });
};










