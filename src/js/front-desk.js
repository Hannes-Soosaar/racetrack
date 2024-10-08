module.exports = (io, socket) => {
    console.log('Setting up front desk');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected from front desk');
    });

    socket.on('g-n-r-s', () => {
        io.emit('trigger-get-next-race-status')
    })


    // Listen for race status updates (e.g., when a race is marked safe to start)
    socket.on('race-status-updated', ({ raceId, status }) => {
        if (status === 'safe_to_start') {
            console.log(`Race ${raceId} is now safe to start!`);
            loadRaces();  // Reload races to reflect the status change
        }
    });

};