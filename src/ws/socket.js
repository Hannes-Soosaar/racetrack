const data = require('../config/const');


module.exports = (io, socket) => {
    console.log("Client connected!");
    socket.on('start-session', () => {
        io.emit('peak', "Text to display");
    });
    socket.on('lets-peak', (value) => {
        console.log("made it to the backend!")
        io.emit('peak', " you sent the :" + value)
    })
    socket.onclose = () => {
        displayMessage('Disconnected from the server. from the WS folder');
    };
    socket.onerror = (error) => {
        displayMessage(`Error: ${error.message}`);
    };
};
