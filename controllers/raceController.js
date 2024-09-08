const db = require('../config/db');

// Create a new race session
exports.createRaceSession = (req, res) => {
    const { race_date, driverCarAssignments = [] } = req.body; // Default to empty array if not provided
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const query = `INSERT INTO races (race_date, created_at, updated_at) VALUES (?, ?, ?)`;

    db.run(query, [race_date, created_at, updated_at], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Could not create race session', details: err });
        }

        const raceId = this.lastID;

        if (driverCarAssignments.length > 0) {
            const insertRaceSlots = `INSERT INTO race_slots (race_id, driver_id, car_number) VALUES (?, ?, ?)`;

            driverCarAssignments.forEach(({ driverId, carNumber }) => {
                db.run(insertRaceSlots, [raceId, driverId, carNumber], (err) => {
                    if (err) {
                        console.error('Error assigning driver and car to race session:', err);
                    }
                });
            });
        }

        res.status(201).json({ id: raceId, race_date });
    });
};


// Get all race sessions
exports.getRaceSessions = (req, res) => {
    const query = `
        SELECT rs.id, rs.race_date, rs.status, d.first_name, d.last_name, d.carNumber
        FROM races rs
        LEFT JOIN race_slots rd ON rs.id = rd.race_id
        LEFT JOIN drivers d ON rd.driver_id = d.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching race sessions:', err.message);  // Log error
            return res.status(500).json({ error: 'Could not retrieve race sessions', details: err.message });
        }
        if (!Array.isArray(rows)) {
            return res.status(500).json({ error: 'Expected an array of race sessions', details: 'Data returned is not an array' });
        }
        res.status(200).json(rows);
    });
};


// Update race session status
exports.updateRaceSession = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated_at = new Date().toISOString();
    
    const query = `UPDATE races SET status = ?, updated_at = ? WHERE id = ?`;

    db.run(query, [status, updated_at, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not update race session', details: err });
        } else if (this.changes === 0) {
            return res.status(404).json({ error: 'Race session not found' });
        }

        res.status(200).json({ id, status });
    });
};

// Delete a race session
exports.deleteRaceSession = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM races WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not delete race session', details: err });
        } else if (this.changes === 0) {
            return res.status(404).json({ error: 'Race session not found' });
        }

        res.status(200).json({ message: 'Race session deleted successfully' });
    });
};

exports.addDriverToRace = (req, res) => {
    const { id } = req.params; // race_id
    const { driverCarAssignments } = req.body;

    const insertRaceSlots = `INSERT INTO race_slots (race_id, driver_id, car_number) VALUES (?, ?, ?)`;

    driverCarAssignments.forEach(({ driverId, carNumber }) => {
        db.run(insertRaceSlots, [id, driverId, carNumber], (err) => {
            if (err) {
                console.error('Error adding driver to race session:', err);
            }
        });
    });

    res.status(201).json({ message: 'Driver added successfully' });
};



// Remove a driver from a race session
exports.removeDriverFromRace = (req, res) => {
    const { id, driverId } = req.params;

    const query = `DELETE FROM race_slots WHERE race_id = ? AND driver_id = ?`;
    db.run(query, [id, driverId], function(err) {
        if (err) {
            console.error('Error removing driver from race session:', err);
            return res.status(500).json({ error: 'Could not remove driver from race session' });
        }
        res.status(200).json({ message: 'Driver removed successfully' });
    });
};

// Get drivers not in a specific race session
exports.getDriversNotInRace = (req, res) => {
    const { id } = req.params; // race_id

    const query = `
        SELECT * FROM drivers 
        WHERE id NOT IN (SELECT driver_id FROM race_slots WHERE race_id = ?)
    `;

    db.all(query, [id], (err, rows) => {
        if (err) {
            console.error('Error retrieving drivers not in race:', err.message);  // Log error
            return res.status(500).json({ error: 'Could not retrieve drivers', details: err.message });
        }
        console.log('Drivers not in race:', rows);  // Debug: log the rows
        res.status(200).json(rows);
    });
};



