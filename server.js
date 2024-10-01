const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./config/db'); // Database connection
dotenv.config();

const app = express(); // Initialize app
const server = http.createServer(app);
const io = socketIo(server);

// Import race control, front desk, and other modules
const { raceControl } = require('./src/js/race-control');
const frontDesk = require('./src/js/front-desk');
const lapLineTracker = require('./src/ws/socket.js');
const raceFlags = require('./src/js/race-flags');
const nextRace = require('./src/js/next-race');
const carController = require('./controllers/carController');

// Import race controller functions
const { createRaceSession, addDriverToRace, updateRaceSession, deleteRaceSession, deleteDriverFromRace, getDriversForRace, getRaceSessions } = require('./controllers/raceController');


app.use(express.json());
app.use(express.static('public')); // Serve static files

// Routes to serve main HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/front-desk', (req, res) => res.sendFile(path.join(__dirname, 'views', 'front-desk.html')));
app.get('/race-control', (req, res) => res.sendFile(path.join(__dirname, 'views', 'race-control.html')));
app.get('/lap-line-tracker', (req, res) => res.sendFile(path.join(__dirname, 'views', 'lap-line-tracker.html')));
app.get('/leaderboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'leaderboard.html')));
app.get('/next-race', (req, res) => res.sendFile(path.join(__dirname, 'views', 'next-race.html')));
app.get('/race-countdown', (req, res) => res.sendFile(path.join(__dirname, 'views', 'race-countdown.html')));
app.get('/race-flags', (req, res) => res.sendFile(path.join(__dirname, 'views', 'race-flags.html')));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log("New client connected:", socket.id);

    // Handle key validation
    socket.on('validate-key', ({ key, role }) => {
        let validKey = false;
        if (role === 'receptionist' && key === process.env.RECEPTIONIST_KEY) {
            validKey = true;
        } else if (role === 'safety' && key === process.env.SAFETY_KEY) {
            validKey = true;
        } else if (role === 'observer' && key === process.env.OBSERVER_KEY) {
            validKey = true;
        }
        console.log(`Key validation result: ${validKey}`);
        socket.emit('key-validation', { success: validKey });
    });

    // Handle race creation via Socket.IO
    socket.on('create-race', (raceData, callback) => {
        createRaceSession({ body: raceData }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 201) {
                        callback({ success: true, race: response });
                    } else {
                        callback({ error: response.error });
                    }
                },
            }),
        });
    });

    // Edit Race via Socket.IO
    socket.on('edit-race', (raceId, raceData, callback) => {
        updateRaceSession({ params: { id: raceId }, body: raceData }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 200) {
                        callback({ success: true, race: response });
                    } else {
                        callback({ error: response.error });
                    }
                },
            }),
        });
    });

    // Delete Race via Socket.IO
    socket.on('delete-race', (raceId, callback) => {
        deleteRaceSession({ params: { id: raceId } }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 200) {
                        callback({ success: true });
                    } else {
                        callback({ error: response.error });
                    }
                },
            }),
        });
    });

    // Handle adding a driver via Socket.IO
    socket.on('add-driver', ({ raceId, driverData }, callback) => {
        addDriverToRace({ params: { id: raceId }, body: driverData }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 201) {
                        callback({ success: true });
                    } else {
                        callback({ error: response.error });
                    }
                },
            }),
        });
    });

    // Remove Driver from Race via Socket.IO
    socket.on('remove-driver', ({ raceId, driverId }, callback) => {
        deleteDriverFromRace({ params: { raceId, driverId } }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 200) {
                        callback({ success: true });
                    } else {
                        callback({ error: response.error });
                    }
                },
            }),
        });
    });

    // Get Drivers for a Race via Socket.IO
    socket.on('get-drivers', (raceId, callback) => {
        getDriversForRace({ params: { id: raceId } }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 200) {
                        callback({ drivers: response });  // Ensure you're returning an array of drivers
                    } else {
                        callback({ error: response.error });
                    }
                },
            }),
        });
    });

    socket.on('get-available-cars', (raceId, callback) => {
        carController.getCarsForRace({ params: { raceId } }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 200) {
                        callback(response);  // Return cars to the front-end
                    } else {
                        callback([]);  // Return an empty array if there’s an error
                    }
                }
            })
        });
    });

    

    // Get All Races via Socket.IO
    socket.on('get-races', (callback) => {
        getRaceSessions({}, {
            status: (code) => ({
                json: (response) => {
                    console.log('Races from server:', response);  // Log what is being returned
                    if (code === 200) {
                        callback(response);  // Send the array of races
                    } else {
                        callback([]);  // Return an empty array on error
                    }
                },
            })
        });
    });
    


    // Handle public views for race flags or next race
    socket.on('public-view', (page) => {
        if (page === 'race-flags') {
            raceFlags(io, socket);
            console.log('Connected to race flags');
        } else if (page === 'next-race') {
            nextRace(io, socket);
            console.log('Connected to next race');
        }
    });

    // Additional real-time race control or lap tracking
    lapLineTracker(io, socket);
    raceControl(io, socket);
    frontDesk(io, socket);

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
