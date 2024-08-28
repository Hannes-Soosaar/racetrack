// src/raceControl.js
module.exports = (io, socket) => {
    console.log('Setting up race control');

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

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected from race control');
    });
};
