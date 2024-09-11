const data = require('../config/const');

const { startTimer } = require('../js/timer.js');


module.exports = (io, socket) => {
    console.log("Client connected!");

    socket.on('start-session', () => {
        io.emit('peak', "Text to display");

    });

    // Trigger is FE lap line tracker.
    socket.on('lets-peak', (value) => {
        console.log("made it to the backend!" + value)
        io.emit('peak', " you sent the :" + value)
        console.log("passed in value" + value); // works 
        startTimer(data.RACE_DURATION);
        //TODO: add function to complete a lap and update the time.
    });

    socket.onclose = () => {
        displayMessage('Disconnected from the server. from the WS folder');
    };

    socket.onerror = (error) => {
        displayMessage(`Error: ${error.message}`);
    };
};
