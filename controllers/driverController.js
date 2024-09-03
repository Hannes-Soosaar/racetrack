const db = require('../config/db');

// Create a new driver
exports.createDriver = (req, res) => {
    const { firstName, lastName, carNumber, status } = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    if (!firstName || !lastName || !carNumber) {
        return res.status(400).json({ error: 'First name, last name, and car number are required' });
    }

    // Check if the car is already assigned
    const checkCarQuery = `SELECT * FROM cars WHERE number = ? AND driver_id IS NOT NULL`;
    db.get(checkCarQuery, [carNumber], (err, row) => {
        if (err) {
            console.error('Error checking car availability:', err);
            return res.status(500).json({ error: 'Failed to check car availability', details: err.message });
        }

        if (row) {
            // If the car is already assigned, return an error
            return res.status(400).json({ error: 'Car is already assigned to another driver' });
        }

        // Insert the new driver
        const query = `INSERT INTO drivers (first_name, last_name, carNumber, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(query, [firstName, lastName, carNumber, status, createdAt, updatedAt], function(err) {
            if (err) {
                console.error('Error inserting driver into database:', err);
                return res.status(500).json({ error: 'Failed to add driver', details: err.message });
            }

            // Update the corresponding car's driver_id
            const driverId = this.lastID;
            const updateCarQuery = `UPDATE cars SET driver_id = ? WHERE number = ?`;
            db.run(updateCarQuery, [driverId, carNumber], function(err) {
                if (err) {
                    console.error('Error updating car with driver_id:', err);
                    return res.status(500).json({ error: 'Failed to assign car to driver', details: err.message });
                }
                res.status(201).json({ id: driverId, firstName, lastName, carNumber, status, createdAt, updatedAt });
            });
        });
    });
};


// Get all drivers
exports.getDrivers = (req, res) => {
    const query = `SELECT * FROM drivers`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message); // Log the detailed error message
            return res.status(500).json({ error: 'Could not retrieve drivers', details: err.message });
        } 
        if (!Array.isArray(rows)) {
            console.error('Unexpected response from the database:', rows);
            return res.status(500).json({ error: 'Unexpected response from the database' });
        }
        
        console.log('Drivers fetched successfully:', rows);
        res.status(200).json(rows);
    });
};

// Update a driver
exports.updateDriver = (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, status, carNumber } = req.body;

    // First, unassign the current car from the driver
    const unassignCarQuery = `UPDATE cars SET driver_id = NULL WHERE driver_id = ?`;
    db.run(unassignCarQuery, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not unassign current car from driver', details: err.message });
        }

        // Then update the driver
        const query = `UPDATE drivers SET first_name = ?, last_name = ?, status = ?, carNumber = ? WHERE id = ?`;
        db.run(query, [firstName, lastName, status, carNumber, id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Could not update driver', details: err.message });
            } else if (this.changes === 0) {
                return res.status(404).json({ error: 'Driver not found' });
            }

            // Assign the new car to the driver
            const updateCarQuery = `UPDATE cars SET driver_id = ? WHERE number = ?`;
            db.run(updateCarQuery, [id, carNumber], function(err) {
                if (err) {
                    console.error('Error updating car with new driver_id:', err);
                    return res.status(500).json({ error: 'Failed to assign new car to driver', details: err.message });
                }
                res.status(200).json({ id, firstName, lastName, status, carNumber });
            });
        });
    });
};


// Delete a driver
exports.deleteDriver = (req, res) => {
    const { id } = req.params;

    // First, unassign the car from the driver
    const unassignCarQuery = `UPDATE cars SET driver_id = NULL WHERE driver_id = ?`;
    db.run(unassignCarQuery, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not unassign car from driver', details: err.message });
        }

        // Then delete the driver
        const deleteDriverQuery = `DELETE FROM drivers WHERE id = ?`;
        db.run(deleteDriverQuery, [id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Could not delete driver', details: err.message });
            } else if (this.changes === 0) {
                return res.status(404).json({ error: 'Driver not found' });
            } else {
                res.status(200).json({ message: 'Driver deleted successfully' });
            }
        });
    });
};

