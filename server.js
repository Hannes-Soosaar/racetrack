const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to SQLite
connectDB();

// Initialize express and socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware for parsing JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the front desk interface
app.get('/front-desk', (req, res) => {
    res.sendFile(__dirname + '/views/front-desk.html');
});

// Socket.io event handling
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

    // Handle start race event
    socket.on('start-race', () => {
        io.emit('race-status', 'Race started');
    });

    // Handle change mode event
    socket.on('change-mode', (mode) => {
        io.emit('race-mode', mode);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
