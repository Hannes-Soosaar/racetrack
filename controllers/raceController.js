const db = require('../config/db.js');
const carController = require('./carController');

// Create a new race session and generate cars
const createRaceSession = (raceData) => {
    return new Promise((resolve, reject) => {
        const { session_name, date, time, status } = raceData;

        // Check if a race with the same session name already exists
        const checkDuplicateQuery = `SELECT COUNT(*) AS count FROM races WHERE session_name = ?`;
        db.get(checkDuplicateQuery, [session_name], (err, row) => {
            if (err) {
                return reject(new Error('Could not verify session name uniqueness'));
            }

            if (row.count > 0) {
                return reject(new Error('A race with this name already exists. Please choose a different name.'));
            }

            // Proceed to create the race session if the name is unique
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
};


// Get all race sessions
const getRaceSessions = (req, res) => {
    const query = `SELECT * FROM races`;
    db.all(query, [], (err, rows) => {
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
const deleteRaceSession = (req, res) => {
    const { id } = req.params;  // Race ID from the URL
    const query = `DELETE FROM races WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Could not delete race', details: err });
        }
        res.status(200).json({ message: 'Race deleted successfully' });
    });
};


const addDriverToRace = (req, res) => {
    const { id } = req.params;  // Race session ID
    const { firstName, lastName, carNumber } = req.body;
    console.log('Incoming driver data:', { firstName, lastName, carNumber });
    // Ensure that firstName, lastName, and carNumber are passed
    if (!firstName || !lastName || !carNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check if a driver with the same first and last name already exists
    const checkNameQuery = `SELECT COUNT(*) AS count FROM drivers WHERE first_name = ? AND last_name = ?`;
    db.get(checkNameQuery, [firstName, lastName], function (err, row) {
        if (err) {
            return res.status(500).json({ error: 'Could not verify driver name', details: err });
        }
        if (row.count > 0) {
            // Driver with the same first and last name exists
            return res.status(400).json({ error: 'A driver with this first and last name already exists. First or last name should be different.' });
        }
        // Check if the car number is already assigned in the race
        const checkCarNumberQuery = `SELECT COUNT(*) AS count FROM race_drivers WHERE race_id = ? AND car_number = ?`;
        db.get(checkCarNumberQuery, [id, carNumber], function (err, row) {
            if (err) {
                return res.status(500).json({ error: 'Could not verify car number', details: err });
            }
            if (row.count > 0) {
                // Car is already assigned, send custom error message
                return res.status(400).json({ error: `This car is already participating in the race.` });
            }
            // Insert the driver into the drivers table
            const insertDriverQuery = `INSERT INTO drivers (first_name, last_name) VALUES (?, ?)`;
            db.run(insertDriverQuery, [firstName, lastName], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Could not add driver', details: err });
                }
                const driverId = this.lastID;  // Get the newly inserted driver ID
                // Assign the driver to the race with the car number
                const insertRaceDriverQuery = `INSERT INTO race_drivers (race_id, driver_id, car_number) VALUES (?, ?, ?)`;
                db.run(insertRaceDriverQuery, [id, driverId, carNumber], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Could not assign driver to race', details: err });
                    }
                    res.status(201).json({ message: 'Driver added to race successfully' });
                });
            });
        });
    });
};


// Get drivers for a specific race
const getDriversForRace = (req, res) => {
    const { id } = req.params;  // The race session ID
    const query = `SELECT d.id, d.first_name, d.last_name, rd.car_number
                   FROM race_drivers rd
                   JOIN drivers d ON rd.driver_id = d.id
                   WHERE rd.race_id = ?`;
    db.all(query, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve drivers for this race', details: err });
        }
        res.status(200).json(rows);
    });
};


const deleteDriverFromRace = (req, res) => {
    const { raceId, driverId } = req.params;

    console.log(`Deleting driver with ID ${driverId} from race ${raceId}`);  // Log driverId and raceId for debugging

    if (!driverId || !raceId) {
        return res.status(400).json({ error: 'Invalid driver ID or race ID' });
    }

    // Remove the driver from the `race_drivers` table
    const deleteFromRaceDriversQuery = `DELETE FROM race_drivers WHERE race_id = ? AND driver_id = ?`;
    db.run(deleteFromRaceDriversQuery, [raceId, driverId], function (err) {
        if (err) {
            console.error('Error deleting driver from race_drivers:', err);
            return res.status(500).json({ error: 'Could not delete driver from the race', details: err });
        }

        console.log(`Driver with ID ${driverId} successfully deleted from race ${raceId}`);

        // Optionally, delete the driver from the `drivers` table as well
        const deleteFromDriversQuery = `DELETE FROM drivers WHERE id = ?`;
        db.run(deleteFromDriversQuery, [driverId], function (err) {
            if (err) {
                console.error('Error deleting driver from drivers table:', err);
                return res.status(500).json({ error: 'Could not delete driver from database', details: err });
            }

            console.log(`Driver with ID ${driverId} successfully deleted from database`);
            res.status(200).json({ message: 'Driver deleted successfully' });
        });
    });
};

console.log('createRaceSession is', createRaceSession);

 
module.exports = {
    createRaceSession,
    getRaceSessions,
    updateRaceSession,
    getRaceById, 
    deleteRaceSession,
    addDriverToRace,
    getDriversForRace,
    deleteDriverFromRace
};

















