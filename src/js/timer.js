let timerInterval;
let racePaused = false;
let raceInProgress = false;
let pauseDuration = 0;
let pauseStart = 0;
let remainingRaceTime = 0;


// Bug we can hit start more than once.
function startTimer(io, raceDurationMs) {
    if (raceInProgress) {
        console.log("No no no, it already started!");
        return;
    }

    console.log("The race duration is:" + raceDurationMs);
    let remainingRaceTime = raceDurationMs;
    const startTime = Date.now();
    raceInProgress = true;
    timerInterval = setInterval(() => {
        if (racePaused) return; // might not be needed!
        const elapsedTime = Date.now() - startTime - pauseDuration;
        remainingRaceTime = raceDurationMs - elapsedTime;

        if (remainingRaceTime <= 0) {
            remainingRaceTime = 0;
            clearInterval(timerInterval);
            raceInProgress = false;
        }
        io.emit('time-update', remainingRaceTime);
        console.log("the value" + remainingRaceTime)
        updateTime(remainingRaceTime);
    }, 100);
}


// Does not start the pause for the race time
function pauseTimer() {
    if (raceInProgress && !racePaused) {
        racePaused = true;
        console.log("Race paused");
        pauseStart = Date.now();
    }
}


function resumeTimer() {
    if (raceInProgress && racePaused) {
        racePaused = false;
        pauseDuration += Date.now() - pauseStart;
        console.log("Race resumed")
    }
}


// Clears global variable.
function stopTimer() {
    clearInterval(timerInterval);
    raceInProgress = false;
    racePaused = false;
    pauseDuration = 0;
    pauseStart = 0;
    remainingRaceTime = 0;
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
