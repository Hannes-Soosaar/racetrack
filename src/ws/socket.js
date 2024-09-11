const data = require('../config/const');
const time = require('../js/timer.js');


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
        //TODO: add function to complete a lap and update the time.
    });

    socket.onclose = () => {
        displayMessage('Disconnected from the server. from the WS folder');
    };

    socket.onerror = (error) => {
        displayMessage(`Error: ${error.message}`);
    };

    //! FROM HERE WE HAVE TIMER OPERATIONS

    socket.on('start-timer', () => {
        console.log("Start-timer");
        io.emit('peak', "Race started");
        console.log(data.RACE_DURATION);
        time.startTimer(io, data.RACE_DURATION);
    });

    socket.on('pause-timer', () => {
        console.log("Pause-timer");
        io.emit('peak', "Race Paused");
        time.pauseTimer();
    });

    socket.on('resume-timer', () => {
        console.log("resume-timer");
        io.emit('peak', "Timer Resumed");
        time.resumeTimer();
    })

    socket.on('stop-timer', () => {
        console.log("stop-timer");
        io.emit('peak', "Timer Stopped")
        time.stopTimer();
    })

    // Should run with the same frequency as function updates! 
    socket.on('update-time', () => {
        let timeElapsed = time.updateTime();
        io.emit('time-elapsed', timeElapsed);

    })

}
