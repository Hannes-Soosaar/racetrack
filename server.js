const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if access keys are set
if (!process.env.RECEPTIONIST_KEY || !process.env.OBSERVER_KEY || !process.env.SAFETY_KEY) {
    console.error("Error: Environment variables for access keys are not set.");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for each interface
app.get('/front-desk', (req, res) => {
    res.sendFile(__dirname + '/public/front-desk.html');
});

app.get('/race-control', (req, res) => {
    res.sendFile(__dirname + '/public/race-control.html');
});

app.get('/lap-line-tracker', (req, res) => {
    res.sendFile(__dirname + '/public/lap-line-tracker.html');
});

app.get('/leader-board', (req, res) => {
    res.sendFile(__dirname + '/public/leader-board.html');
});

app.get('/next-race', (req, res) => {
    res.sendFile(__dirname + '/public/next-race.html');
});

app.get('/race-countdown', (req, res) => {
    res.sendFile(__dirname + '/public/race-countdown.html');
});

app.get('/race-flags', (req, res) => {
    res.sendFile(__dirname + '/public/race-flags.html');
});

// Handle socket.io connections
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

        if (validKey) {
            socket.emit('key-validation', { success: true });
        } else {
            setTimeout(() => {
                socket.emit('key-validation', { success: false });
            }, 500);
        }
    });

    // Handle race control actions
    socket.on('start-race', () => {
        io.emit('race-status', 'Race started');
    });

    socket.on('change-mode', (mode) => {
        io.emit('race-mode', mode);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
