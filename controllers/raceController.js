const db = require('../config/db.js');
const carController = require('./carController');
const { dbRun } = require('../src/js/race-control.js')

// Create a new race session and generate cars
const createRaceSession = (raceData) => {
    return new Promise((resolve, reject) => {
        const { session_name, date, time, status } = raceData;

        // Validate if the race date and time are in the future
        const raceDateTime = new Date(`${date} ${time}`);
        const currentDateTime = new Date();

        if (raceDateTime <= currentDateTime) {
            return reject(new Error('Cannot create a race in the past. Please choose a future date and time.'));
        }

        // Check if a race with the same session name already exists
        const checkDuplicateQuery = `SELECT COUNT(*) AS count FROM races WHERE session_name = ?`;
        db.get(checkDuplicateQuery, [session_name], (err, row) => {
            if (err) {
                return reject(new Error('Could not verify session name uniqueness'));
            }

            if (row.count > 0) {
                return reject(new Error('A race with this name already exists. Please choose a different name.'));
            }

            // Check if another race is already scheduled for the same date and time
            const checkDateTimeQuery = `SELECT COUNT(*) AS count FROM races WHERE date = ? AND time = ?`;
            db.get(checkDateTimeQuery, [date, time], (err, row) => {
                if (err) {
                    return reject(new Error('Could not verify race time uniqueness'));
                }

                if (row.count > 0) {
                    return reject(new Error('A race is already scheduled for this date and time. Please choose a different time.'));
                }

                // Proceed to create the race session if no conflicts
                const query = `INSERT INTO races (session_name, date, time, status) VALUES (?, ?, ?, ?)`;
                db.run(query, [session_name, date, time, status], function (err) {
                    if (err) {
                        return reject(new Error('Could not create race session'));
                    }

                    const raceId = this.lastID;  // Capture the race ID
                    resolve({ id: raceId, session_name, date, time, status });
                });
            });
        });
    });
};




// Get all race sessions
const getRaceSessions = (req, res) => {
    const query = `SELECT * FROM races WHERE status = ?`;
    db.all(query, ['upcoming'], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Could not retrieve races', details: err });
        }
        res.status(200).json(rows);  // Return the rows, which should be an array of races
    });
};


// Update a race session
const updateRaceSession = (raceId, raceData) => {
    return new Promise((resolve, reject) => {
        const { session_name, date, time } = raceData;
        const query = `UPDATE races SET session_name = ?, date = ?, time = ? WHERE id = ?`;

        db.run(query, [session_name, date, time, raceId], function (err) {
            if (err) {
                return reject(new Error('Could not update race'));
            }
            resolve();
        });
    });
};


const getRaceById = (raceId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM races WHERE id = ?`;
        db.get(query, [raceId], (err, row) => {
            if (err) {
                return reject(new Error('Could not retrieve race details'));
            }
            resolve(row);
        });
    });
};


// Delete a race session
const deleteRaceSession = async (req, res) => {
    const { id } = req.params; // Race ID from the URL

    const deleteRaceQuery = `DELETE FROM races WHERE id = ?`;

    try {
        // Delete the race
        await dbRun(deleteRaceQuery, [id]);

        // Delete associated cars
        const deleteCarsQuery = `DELETE FROM cars WHERE race_id = ?`;
        await dbRun(deleteCarsQuery, [id]);

        // Delete associated drivers
        const deleteDriversQuery = `
            DELETE FROM drivers
            WHERE id IN (
                SELECT d.id
                FROM drivers d
                INNER JOIN race_drivers rd ON d.id = rd.driver_id
                WHERE rd.race_id = ?
            )`;
        await dbRun(deleteDriversQuery, [id]);

        // Delete associated race drivers
        const deleteRaceDriversQuery = `DELETE FROM race_drivers WHERE race_id = ?`;
        await dbRun(deleteRaceDriversQuery, [id]);

        // Send a success response
        res.status(200).json({ message: 'Race session and associated data deleted successfully' });

    } catch (err) {
        // Handle errors
        return res.status(500).json({ error: 'Could not delete race session', details: err });
    }
};



const addDriverToRace = (req, res) => {
    const { id: raceId } = req.params;  // Race session ID
    const { firstName, lastName, carNumber } = req.body;

    // Log incoming data to verify it
    console.log('Incoming driver data:', { firstName, lastName, carNumber });

    if (!firstName || !lastName || !carNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const checkExistingDriverQuery = `
        SELECT d.id
        FROM drivers d
        INNER JOIN race_drivers rd ON d.id = rd.driver_id
        WHERE d.first_name = ? AND d.last_name = ? AND rd.race_id = ?`;

    db.all(checkExistingDriverQuery, [firstName, lastName, raceId], (err, existingDriver) => {
        if (err) {
            return res.status(500).json({ error: 'Could not check for existing driver', details: err });
        }

        if (existingDriver.length > 0) {
            return res.status(400).json({ error: 'Driver with that name already exists in this race.' });
        }

        // Ensure driver data is properly inserted
        const insertDriverQuery = `INSERT INTO drivers (first_name, last_name) VALUES (?, ?)`;
        db.run(insertDriverQuery, [firstName, lastName], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Could not add driver', details: err });
            }
            const driverId = this.lastID;

            // Assign the driver to the race with the car number
            const insertRaceDriverQuery = `INSERT INTO race_drivers (race_id, driver_id, car_number) VALUES (?, ?, ?)`;
            db.run(insertRaceDriverQuery, [raceId, driverId, carNumber], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Could not assign driver to race', details: err });
                }
                res.status(201).json({ message: 'Driver added to race successfully' });
            });
        });
    });
};




// Get drivers for a specific race
const getDriversForRace = (req, res) => {
    const { id } = req.params;  // The race session ID
    const query = `
        SELECT d.id, d.first_name, d.last_name, (d.first_name || ' ' || d.last_name) AS driver_name, rd.car_number
FROM race_drivers rd
JOIN drivers d ON rd.driver_id = d.id
WHERE rd.race_id = ?

    `;
    db.all(query, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve drivers for this race', details: err });
        }
        if (!rows || rows.length === 0) {
            console.log('No drivers found for race:', id);
        } else {
            console.log('Drivers found:', rows);
        }
        res.status(200).json(rows);
    });
};




const deleteDriverFromRace = (req, res) => {
    const { raceId, driverId } = req.params;

    // Check if the race is safe to start
    const checkRaceStatusQuery = `SELECT status FROM races WHERE id = ?`;
    db.get(checkRaceStatusQuery, [raceId], (err, row) => {
        if (err || !row) {
            return res.status(500).json({ error: 'Error checking race status', details: err });
        }

        if (row.status === 'safe_to_start') {
            return res.status(400).json({ error: 'Cannot modify drivers once the race is safe to start.' });
        }

        // Proceed with deleting the driver
        const deleteFromRaceDriversQuery = `DELETE FROM race_drivers WHERE race_id = ? AND driver_id = ?`;
        db.run(deleteFromRaceDriversQuery, [raceId, driverId], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Could not delete driver from the race', details: err });
            }

            const deleteFromDriversQuery = `DELETE FROM drivers WHERE id = ?`;
            db.run(deleteFromDriversQuery, [driverId], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Could not delete driver from database', details: err });
                }

                res.status(200).json({ message: 'Driver deleted successfully' });
            });
        });
    });
};



// Edit driver details in a race
const editDriverInRace = (req, res) => {
    const { raceId, driverId } = req.params;  // Race session ID and driver ID
    const { firstName, lastName, carNumber } = req.body;
    // Check if the race is safe to start
    const checkRaceStatusQuery = `SELECT status FROM races WHERE id = ?`;
    db.get(checkRaceStatusQuery, [raceId], (err, row) => {
        if (err || !row) {
            return res.status(500).json({ error: 'Error checking race status', details: err });
        }

        if (row.status === 'safe_to_start') {
            return res.status(400).json({ error: 'Cannot modify drivers once the race is safe to start.' });
        }

        console.log('Incoming updated driver data:', { firstName, lastName, carNumber });

        if (!firstName || !lastName || !carNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if a driver with the same first name, last name exists for this race (excluding the current driver)
        const checkDriverQuery = `
        SELECT COUNT(*) AS count 
        FROM race_drivers rd 
        JOIN drivers d ON rd.driver_id = d.id 
        WHERE rd.race_id = ? AND d.first_name = ? AND d.last_name = ? AND d.id != ?`;

        db.get(checkDriverQuery, [raceId, firstName, lastName, driverId], function (err, row) {
            if (err) {
                return res.status(500).json({ error: 'Error checking driver uniqueness', details: err });
            }
            if (row.count > 0) {
                // Driver with the same name and surname already exists for this race
                return res.status(400).json({ error: 'Another driver with this name and surname already exists in the race' });
            }

            // Check if the car number is already assigned in the race (excluding the current driver)
            const checkCarNumberQuery = `SELECT COUNT(*) AS count FROM race_drivers WHERE race_id = ? AND car_number = ? AND driver_id != ?`;
            db.get(checkCarNumberQuery, [raceId, carNumber, driverId], function (err, row) {
                if (err) {
                    return res.status(500).json({ error: 'Error checking car number', details: err });
                }
                if (row.count > 0) {
                    return res.status(400).json({ error: `This car is already assigned to another driver in the race.` });
                }

                // Update the driver information
                const updateDriverQuery = `UPDATE drivers SET first_name = ?, last_name = ? WHERE id = ?`;
                db.run(updateDriverQuery, [firstName, lastName, driverId], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Could not update driver details', details: err });
                    }

                    // Update the car number for the driver in the race
                    const updateRaceDriverQuery = `UPDATE race_drivers SET car_number = ? WHERE race_id = ? AND driver_id = ?`;
                    db.run(updateRaceDriverQuery, [carNumber, raceId, driverId], function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Could not update driver assignment in the race', details: err });
                        }
                        res.status(200).json({ message: 'Driver details updated successfully' });
                    });
                });
            });
        });
    });
};



module.exports = {
    createRaceSession,
    getRaceSessions,
    updateRaceSession,
    getRaceById,
    deleteRaceSession,
    addDriverToRace,
    getDriversForRace,
    deleteDriverFromRace,
    editDriverInRace,
};

















