module.exports = (io, socket) => {
    console.log('Setting up front desk');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected from front desk');
    });

    socket.on('g-n-r-s', () => {
        io.emit('trigger-get-next-race-status')
    })
};