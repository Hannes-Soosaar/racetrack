const db = require('../config/db');

// Create a new race session
exports.createRaceSession = (req, res) => {
    const { session_name, date, time, status } = req.body;
    const query = `INSERT INTO races (session_name, date, time, status) VALUES (?, ?, ?, ?)`;

    db.run(query, [session_name, date, time, status], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not create race session', details: err });
        }
        res.status(201).json({ id: this.lastID, session_name, date, time, status });
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

    const insertDriverQuery = `INSERT INTO drivers (first_name, last_name) VALUES (?, ?)`;

    db.run(insertDriverQuery, [firstName, lastName], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Could not add driver', details: err });
        }

        const driverId = this.lastID;  // Get the last inserted driver ID

        const insertRaceDriverQuery = `INSERT INTO race_drivers (race_id, driver_id, car_number) VALUES (?, ?, ?)`;
        db.run(insertRaceDriverQuery, [id, driverId, carNumber], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Could not assign driver to race', details: err });
            }

            res.status(201).json({ message: 'Driver added to race successfully' });
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

function loadDriversForRace(raceId) {
    fetch(`/api/races/${raceId}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            const driverList = document.getElementById(`driver-list-${raceId}`);
            driverList.innerHTML = '';  

            if (!Array.isArray(drivers)) {
                console.error('Expected an array of drivers, but got:', drivers);
                return;
            }

            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = `${driver.first_name} ${driver.last_name} (Car: ${driver.car_number})`;
                driverList.appendChild(li);
            });
        })
        .catch(error => {
            console.error(`Error loading drivers for race ${raceId}:`, error);
        });
}

function loadRaces() {
    fetch('/api/races')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load races');
            }
            return response.json();
        })
        .then(races => {
            const raceList = document.getElementById('race-list');
            raceList.innerHTML = '';  // Clear existing races

            races.forEach(race => {
                const raceItem = document.createElement('div');
                raceItem.innerHTML = `
                    <strong>${race.session_name}</strong> - ${race.date} ${race.time}
                    <button onclick="editRace(${race.id})">Edit Race</button>
                    <button onclick="deleteRace(${race.id})">Delete Race</button>

                    <h3>Add Drivers to ${race.session_name}</h3>
                    <form onsubmit="addDriverToRace(event, ${race.id})">
                        <label for="first-name-${race.id}">First Name:</label>
                        <input type="text" id="first-name-${race.id}" required>
                        
                        <label for="last-name-${race.id}">Last Name:</label>
                        <input type="text" id="last-name-${race.id}" required>

                        <label for="car-number-${race.id}">Car Number:</label>
                        <select id="car-number-${race.id}" required>
                            <!-- Populate cars here -->
                        </select>

                        <button type="submit">Save Driver</button>
                    </form>
                    <ul id="driver-list-${race.id}"></ul> <!-- List of drivers for this race -->
                `;

                raceList.appendChild(raceItem);

                // Call loadDriversForRace for each race
                loadDriversForRace(race.id);  // Call the function here to load drivers for this race
            });
        })
        .catch(error => {
            console.error('Error loading races:', error);
        });
}






