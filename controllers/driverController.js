const db = require('../config/db');

// Create a new driver
exports.createDriver = (req, res) => {
    const { name, carNumber } = req.body;
    const query = `INSERT INTO drivers (name, carNumber) VALUES (?, ?)`;

    db.run(query, [name, carNumber], function(err) {
        if (err) {
            res.status(500).json({ error: 'Could not add driver', details: err });
        } else {
            res.status(201).json({ id: this.lastID, name, carNumber });
        }
    });
};

// Get all drivers
exports.getDrivers = (req, res) => {
    const query = `SELECT * FROM drivers`;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Could not retrieve drivers', details: err });
        } else {
            res.status(200).json(rows);
        }
    });
};
