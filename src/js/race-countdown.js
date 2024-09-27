

console.log("Hello!");

module.exports = (io, socket) => {
    console.log('Timer Started');
    // Handle disconnection
  
    socket.on('disconnect', () => {
        console.log('Client disconnected from front desk');
    });

    socket.on('update-time', ()=>{
        //TODO: 
    });

};