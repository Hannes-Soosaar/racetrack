const status = require('../config/const');
const time = require('../js/timer.js');
const lineTracker = require("../js/lap-line-tracker.js");
const car = require("../js/car.js");

module.exports = (io, socket) => {
    console.log("Client connected!");
    socket.on('start-session', () => {
        io.emit('peak', "Text to display");
    });
    //! Delete this 
    // socket.on('lets-peak', (value) => {
    //     console.log("made it to the backend!" + value)
    //     io.emit('peak', " you sent the :" + value)
    //     console.log("passed in value" + value); // works 
    // });
    // Not connected
    socket.on('set-up-race', (raceId) => {
        console.log("you want to start the race", raceId);
        //TODO
    });


    //TODO: entry point for
    socket.on('set-lap', (carNumber) => {
        console.log('setting lapp for car number' + carNumber);
        //  socket.emit('get-race-id');   // Get the CarNumber
        // Get the active Race
        // update the lap Time 
        // update the Time when the lap was completed
        // update the leader board
    });


    socket.onclose = () => {
        displayMessage('Disconnected from the server. from the WS folder');
    };

    socket.onerror = (error) => {
        displayMessage(`Error: ${error.message}`);
    };

    socket.on('start-timer', () => {
        console.log("Start-timer");
        io.emit('peak', "Race started");
        console.log(status.RACE_DURATION);
        time.startTimer(io, status.RACE_DURATION);
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
    });
    //! This could be removed!
    socket.on('raceId-set', (raceId) => {
        console.log('Race Id recieved at the backend ', raceId);
        //TODO:
        //
    });

    socket.on('set-lap', async (raceIdCarNumber) => {
        try {
            console.log('We need to modify the car in slot1 for the Race with the ID', raceIdCarNumber);
            raceId = raceIdCarNumber[0];
            carNumber = raceIdCarNumber[1];
            carIds = await car.getCarIdsByRaceId(raceId);
            if (carIds) {
                console.log("the Cars Id in the race are", carIds);
            } else {
                console.log("No cars");
            }
        } catch (error) {
            console.log("error during set-lap event", errror);
        }






    });
}