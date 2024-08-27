const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./config/db'); // Database connection
const driverRoutes = require('./src/routes/driverRoutes'); // Import driver routes

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public'));

// Register the API routes
app.use('/api', driverRoutes);

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
    console.log('New client connected');
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

    // Handle starting the race
    socket.on('start-race', () => {
        console.log('Race started');
        io.emit('race-status', 'Race started');
        io.emit('race-mode', 'Safe'); // Assuming the race starts in 'Safe' mode
    });

    // Handle changing race mode
    socket.on('change-mode', (mode) => {
        console.log(`Race mode changed to ${mode}`);
        io.emit('race-mode', mode);
    });

    // Handle ending the race
    socket.on('end-race', () => {
        console.log('Race ended');
        io.emit('race-status', 'Race ended');
        io.emit('race-mode', 'Finished');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});




const PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
    //TODO:Check keys!
    console.log(`Server is running on port ${PORT}`);
});
