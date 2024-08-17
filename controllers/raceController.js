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
