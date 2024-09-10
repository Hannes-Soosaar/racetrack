const data = require('../config/const');
const db = require('../../config/db');

const { startTimer } = require('../js/timer.js');

module.exports = (io) => {
    // When a client connects
    io.on('connection', (socket) => {
        console.log("Client connected:", socket.id);

        // Emit test messages to connected clients
        socket.on('start-session', () => {
            io.emit('peak', "Text to display");
        });
        
        socket.on('lets-peak', (value) => {
            console.log("Received value on backend:", value);
            io.emit('peak', "You sent: " + value);
            startTimer(99990);  // Запуск таймера только в одном месте
        });
        
        // Handle session creation
        socket.on('create-session', ({ sessionName }) => {
            const query = `INSERT INTO race_sessions (sessionName) VALUES (?)`;
            db.run(query, [sessionName], function(err) {
                if (err) {
                    socket.emit('session-error', 'Failed to create session');
                } else {
                    // Fetch updated list of sessions and emit
                    db.all('SELECT * FROM race_sessions', [], (err, rows) => {
                        if (!err) {
                            io.emit('session-list', rows);  // Emit the updated list of sessions to all clients
                        }
                    });
                }
            });
        });

        // Handle adding drivers to a session
        socket.on('add-driver', ({ sessionId, driverName, carNumber }) => {
            const addDriverQuery = `INSERT INTO drivers (name, carNumber, sessionId) VALUES (?, ?, ?)`;
            const assignCarQuery = `
                UPDATE cars 
                SET driver_id = (SELECT id FROM drivers WHERE name = ? AND carNumber = ?)
                WHERE number = ? AND sessionId = ?`;

            db.run(addDriverQuery, [driverName, carNumber, sessionId], function(err) {
                if (err) {
                    socket.emit('driver-error', 'Failed to add driver');
                } else {
                    db.run(assignCarQuery, [driverName, carNumber, carNumber, sessionId], function(err) {
                        if (err) {
                            socket.emit('car-assignment-error', 'Failed to assign car to driver');
                        } else {
                            socket.emit('driver-list', getDriversForSession(sessionId)); // Send updated driver list
                        }
                    });
                }
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client ${socket.id} disconnected`);
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error(`Error occurred on socket ${socket.id}:`, error.message);
        });

        // Custom error handlers for WebSocket issues
        socket.onclose = () => {
            console.log('Disconnected from the server.');
        };

        socket.onerror = (error) => {
            console.error(`WebSocket Error: ${error.message}`);
        };
    });
};

// Utility function to get sessions
function getSessions() {
    const query = 'SELECT * FROM race_sessions';
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Utility function to get drivers for a session
function getDriversForSession(sessionId) {
    const query = `
        SELECT d.name, c.number AS carNumber 
        FROM drivers d 
        JOIN cars c ON d.carNumber = c.number 
        WHERE d.sessionId = ?`;
        
    return new Promise((resolve, reject) => {
        db.all(query, [sessionId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
