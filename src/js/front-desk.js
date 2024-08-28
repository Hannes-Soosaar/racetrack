module.exports = (io, socket) => {
    console.log('Setting up front desk');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected from front desk');
    });
};