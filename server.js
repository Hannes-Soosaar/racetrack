const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
// const db = require('./config/db'); // Database connection
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
const leaderBoard = require('./src/js/leaderboard.js');

// Import race controller functions
const {
    createRaceSession,
    addDriverToRace,
    updateRaceSession,
    deleteRaceSession,
    deleteDriverFromRace,
    getDriversForRace,
    getRaceSessions,
    getRaceById,
    editDriverInRace,
} = require('./controllers/raceController');


const { createCarsForRace } = require('./controllers/carController');
const { env } = require('process');

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

io.on('connection', (socket) => {
    console.log("New client connected:", socket.id);
    lapLineTracker(io, socket);
    raceControl(io, socket);
    frontDesk(io, socket);

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
        if (validKey) {
            socket.emit('key-validation', { success: validKey });
        } else {
            setTimeout(() => {
                socket.emit('key-validation', { success: validKey });
                console.log('500ms timeout');
            }, 500);
        }
    });

    socket.on('public-view', (page) => {
        if (page === 'race-flags') {
            raceFlags(io, socket);
            console.log('Connected to race flags');
        } else if (page === 'next-race') {
            nextRace(io, socket);
            console.log('Connected to next race');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('create-race', async (raceData, callback) => {
        try {
            const race = await createRaceSession(raceData);
            await createCarsForRace(race.id);  // Ensure all cars are created before sending a callback
            callback({ success: true, race });
        } catch (error) {
            callback({ error: 'Race creation failed: ' + error.message });
        }
    });

    socket.on('get-race-details', (raceId, callback) => {
        getRaceById(raceId).then((race) => {
            callback({ race });
        }).catch((err) => {
            callback({ error: 'Error fetching race details: ' + err.message });
        });
    });

    socket.on('edit-race', async (raceId, raceData, callback) => {
        try {
            await updateRaceSession(raceId, raceData);
            callback({ success: true, message: 'Race updated successfully' });
        } catch (error) {
            callback({ error: 'Error updating race: ' + error.message });
        }
    });

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

    socket.on('edit-driver', ({ raceId, driverId, driverData }, callback) => {
        editDriverInRace({ params: { raceId, driverId }, body: driverData }, {
            status: (code) => ({
                json: (response) => {
                    if (code === 200) {
                        callback({ success: true });
                    } else {
                        callback({ error: response.error });
                    }
                }
            })
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
});


const PORT = process.env.PORT || 8000;

if (!process.env.RECEPTIONIST_KEY || !process.env.OBSERVER_KEY || !process.env.SAFETY_KEY) {
    console.log('Server cannot start unless environment variables are set. See usage in README.md')
    process.exit(1)
} else {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    if (process.listenerCount('SIGINT') === 0) {
        process.on('SIGINT', () => {
            console.log('\n\nSIGINT');
            io.emit('reload');
            process.exit(0);
        });
    }

    if (process.listenerCount('SIGTERM') === 0) {
        process.on('SIGTERM', () => {
            console.log('\n\nSIGTERM');
            io.emit('reload');
            process.exit(0);
        });
    }
}