const status = require('../config/const');
const time = require('../js/timer.js');
const lineTracker = require("../js/lap-line-tracker.js");
const car = require("../js/car.js");
const leader = require("../js/leaderboard.js");


module.exports = (io, socket) => {

    console.log("Sever extended to socket.js");
    socket.on('start-session', () => {
        io.emit('peak', "Text to display"); // Just to test the connections
    });

    socket.onclose = () => {
        displayMessage('Disconnected from the server. from the WS folder');
    };

    socket.on('leaderboard-connecter', (text) => {
        console.log("backend -", text);
    });

    socket.onerror = (error) => {
        displayMessage(`Error: ${error.message}`);
    };

    socket.on('start-timer', async () => {
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

    //TEST TO SEE IF THIS IS USED!
    // socket.on('set-lap', async (raceIdCarNumber) => {
    //     try {
    //         console.log('We need to modify the car in slot1 for the Race with the ID', raceIdCarNumber);
    //         raceId = raceIdCarNumber[0];
    //         carNumber = raceIdCarNumber[1];
    //         carIds = await car.getCarIdsByRaceId(raceId);
    //         if (carIds) {
    //             console.log("the Cars Id in the race are", carIds);
    //         } else {
    //             console.log("No cars");
    //         }
    //     } catch (error) {
    //         console.log("error during set-lap event", errror);
    //     }
    //     car.setLapTime(carIds[carNumber]);
    // });

    // This is used.
    socket.on('set-car-lap', async (raceIdCarNumber) => {
        try {
            raceId = raceIdCarNumber[0];
            carNumber = raceIdCarNumber[1];
            carIds = await car.getCarIdsByRaceId(raceId);
            if (carIds) {
                await car.setLapTime(carIds[carNumber - 1].id);
                const cars = await car.getCarsByRaceId(raceId);
                io.emit('update-leader-board', cars)
                console.log('the emit was sent!')
            } else {
                console.log("No cars");
            }
        } catch (error) {
            console.log("error during set-lap event", error);
        }
    });
}