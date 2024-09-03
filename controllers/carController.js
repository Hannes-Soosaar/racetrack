const db = require('../config/db');

// Get all available cars (cars without a driver assigned)
exports.getCars = (req, res) => {
    const query = `SELECT * FROM cars WHERE driver_id IS NULL`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Could not retrieve cars', details: err.message });
        }
        res.status(200).json(rows);
    });
};
