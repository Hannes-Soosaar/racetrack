const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db'); // Import the database connection

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public'));

app.get('/front-desk', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'front-desk.html'));
});

io.on('connection', (socket) => {
    console.log('New client connected');

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

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
