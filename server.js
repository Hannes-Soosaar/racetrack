const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./config/db');
const driverRoutes = require('./src/routes/driverRoutes'); // Import driver routes
const carRoutes = require('./src/routes/carRoutes'); // Import car routes
const raceRoutes = require('./src/routes/raceRoutes');
dotenv.config();

const app = express(); // Initialize app here
const server = http.createServer(app);
const io = socketIo(server);


const raceControl = require('./src/js/race-control'); // Import race control
const frontDesk = require('./src/js/front-desk'); // Import front desk
const lapLineTracker = require('./src/ws/socket.js'); // Import lap line tracker
const raceFlags = require('./src/js/race-flags')

app.use(express.json());
app.use(express.static('public'));

// Register the API routes
app.use('/api', driverRoutes);
app.use('/api', carRoutes);
app.use('/api', raceRoutes);

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route to serve front-desk.html
app.get('/front-desk', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'front-desk.html'));
});

// Route to serve race-control.html
app.get('/race-control', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'race-control.html'));
});

// Add routes for other pages as needed
app.get('/lap-line-tracker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lap-line-tracker.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'leaderboard.html'));
});

app.get('/next-race', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'next-race.html'));
});

app.get('/race-countdown', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'race-countdown.html'));
});

app.get('/race-flags', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'race-flags.html'));
});


// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log("New client connected again:", socket.id);     // ADDEd for debug
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

        if (validKey) {
            if (role === 'receptionist') {
                frontDesk(io, socket)
                console.log("validated as Reception ")
            } else if (role === 'safety') {
                raceControl(io, socket)
                console.log("validated as Safety ")
            } else if (role === 'observer') {
                lapLineTracker(io, socket)
                console.log("validated as observer ")
            }
        }
    });

    socket.on('public-view', (page) => {
        if (page === 'race-flags') {
            raceFlags(io, socket)
            console.log('Connected to race flags')
        }
    })
});

const PORT = process.env.PORT || 8000;
// Start the server
server.listen(PORT, () => {
    //TODO: implement check keys last!
    console.log(`Server is running on port ${PORT}`);
});
