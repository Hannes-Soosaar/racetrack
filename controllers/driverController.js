const db = require('../config/db'); // Assuming you have a db setup in config/db.js

exports.createDriver = (req, res) => {
    const { name, carNumber } = req.body;
    const createdAt = new Date().toISOString(); // Current timestamp
    const updatedAt = createdAt; // Initially, updatedAt is the same as createdAt

    // Ensure both name and carNumber are provided
    if (!name || !carNumber) {
        return res.status(400).json({ error: 'Name and car number are required' });
    }

    // Insert the new driver into the database with createdAt and updatedAt fields
    const query = `INSERT INTO drivers (name, carNumber, createdAt, updatedAt) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, carNumber, createdAt, updatedAt], function(err) {
        if (err) {
            console.error('Error inserting driver into database:', err);
            return res.status(500).json({ error: 'Failed to add driver', details: err.message });
        }
        res.status(201).json({ id: this.lastID, name, carNumber, createdAt, updatedAt });
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

// Update a driver
exports.updateDriver = (req, res) => {
    const { id } = req.params;
    const { name, carNumber, fastestLap } = req.body;
    const query = `UPDATE drivers SET name = ?, carNumber = ?, fastestLap = ? WHERE id = ?`;

    db.run(query, [name, carNumber, fastestLap, id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Could not update driver', details: err });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Driver not found' });
        } else {
            res.status(200).json({ id, name, carNumber, fastestLap });
        }
    });
};

// Delete a driver
exports.deleteDriver = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM drivers WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Could not delete driver', details: err });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Driver not found' });
        } else {
            res.status(200).json({ message: 'Driver deleted successfully' });
        }
    });
};

