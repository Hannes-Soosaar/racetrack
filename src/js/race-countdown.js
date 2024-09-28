
//TODO: Check if used if not erase!
console.log("Hello!");

module.exports = (io, socket) => {
    console.log('Timer Started');
  
    socket.on('disconnect', () => {
        console.log('Client disconnected from front desk');
    });

    socket.on('update-time', ()=>{
    });

};