const db = require('../config/db');

// Create a new race session
exports.createRaceSession = (req, res) => {
    const { sessionName, driverIds } = req.body;
    const query = `INSERT INTO race_sessions (sessionName) VALUES (?)`;

    db.run(query, [sessionName], function(err) {
        if (err) {
            res.status(500).json({ error: 'Could not create race session', details: err });
        } else {
            const sessionId = this.lastID;
            const insertRaceDrivers = `INSERT INTO race_drivers (sessionId, driverId) VALUES (?, ?)`;

            driverIds.forEach(driverId => {
                db.run(insertRaceDrivers, [sessionId, driverId], (err) => {
                    if (err) {
                        console.error('Could not assign driver to session', err);
                    }
                });
            });

            res.status(201).json({ id: sessionId, sessionName });
        }
    });
};

// Get all race sessions
exports.getRaceSessions = (req, res) => {
    const query = `
        SELECT rs.id, rs.sessionName, rs.isActive, d.name, d.carNumber
        FROM race_sessions rs
        LEFT JOIN race_drivers rd ON rs.id = rd.sessionId
        LEFT JOIN drivers d ON rd.driverId = d.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Could not retrieve race sessions', details: err });
        } else {
            res.status(200).json(rows);
        }
    });
};

// Update a race session
exports.updateRaceSession = (req, res) => {
    const { id } = req.params;
    const { sessionName, isActive } = req.body;
    const query = `UPDATE race_sessions SET sessionName = ?, isActive = ? WHERE id = ?`;

    db.run(query, [sessionName, isActive, id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Could not update race session', details: err });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Race session not found' });
        } else {
            res.status(200).json({ id, sessionName, isActive });
        }
    });
};

// Delete a race session
exports.deleteRaceSession = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM race_sessions WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Could not delete race session', details: err });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Race session not found' });
        } else {
            res.status(200).json({ message: 'Race session deleted successfully' });
        }
    });
};

