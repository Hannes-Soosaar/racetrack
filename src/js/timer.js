let timerInterval;
let racePaused = false;
let raceInProgress = false;
let pauseDuration = 0;
let pauseStart = 0;

function startTimer(io, raceDurationMs) {
    let remainingRaceTime = raceDurationMs
    const startTime = Date.now();
    raceInProgress = true;
    timerInterval = setInterval(() => {
        if (racePaused) return; // might not be needed!
        const elapsedTime = Date.now() - startTime - pauseDuration;
        remainingRaceTime = raceDurationMs - elapsedTime;

        // console.log("the elapsed value " + elapsedTime);
        // console.log("the remaining race time " + remainingRaceTime);
        // console.log("the race duration" + raceDurationMs);

        if (remainingRaceTime <= 0) {
            remainingRaceTime = 0;
            clearInterval(timerInterval);
            raceInProgress = false;
        }
        // ! This is where the time get passade around
        io.emit('time-update', remainingRaceTime); // ! THIS IS THE REALTIME RACE UPDATE 
        console.log("the value" + remainingRaceTime)
        updateTime(remainingRaceTime);
    }, 100);
}

function pauseTimer() {
    if (raceInProgress && !racePaused) {
        racePaused = true;
        console.log("Race paused");
    }
}

function resumeTimer() {
    if (raceInProgress && racePaused) {
        racePaused = false;
        pauseDuration += Date.now() - pauseStart;
        console.log("Race resumed")
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    raceInProgress = false;
    racePaused = false;
    pauseDuration = 0;
    console.log("Race ended")
}

function updateTime(remainingRaceTime) {
    console.log("there are ms left in the race", remainingRaceTime)
    return remainingRaceTime;
}

module.exports = {
    startTimer,
    stopTimer,
    updateTime,
    resumeTimer,
    pauseTimer
};
