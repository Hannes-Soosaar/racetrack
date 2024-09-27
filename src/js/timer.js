let timerInterval;
let racePaused = false;
let raceInProgress = false;
let pauseDuration = 0;
let pauseStart = 0;
let remainingRaceTime = 0;

function startTimer(io, raceDurationMs) {
    if (raceInProgress) {
        console.log("Race already started!");
        return;
    }
    console.log("The race duration is:" + raceDurationMs);
    let remainingRaceTime = raceDurationMs;
    const startTime = Date.now();
    raceInProgress = true;
    timerInterval = setInterval(() => {
        if (racePaused) return; 
        const elapsedTime = Date.now() - startTime - pauseDuration;
        remainingRaceTime = raceDurationMs - elapsedTime;
        if (remainingRaceTime <= 0) {
            remainingRaceTime = 0;
            clearInterval(timerInterval);
            raceInProgress = false;
        }
        raceTimeElapse = displayMinutesAndSeconds(remainingRaceTime);
        io.emit('time-update', raceTimeElapse);
        getUpdateTimerValue(remainingRaceTime);
    }, 100);
}

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

function stopTimer() {
    clearInterval(timerInterval);
    raceInProgress = false;
    racePaused = false;
    pauseDuration = 0;
    pauseStart = 0;
    remainingRaceTime = 0;
    console.log("Race ended")
}

function getUpdateTimerValue() {
    console.log("there are ms left in the race", remainingRaceTime)
    return remainingRaceTime;
}

function displayMinutesAndSeconds(remainingRaceTime) {
    const totalSeconds = Math.floor(remainingRaceTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds}`;
}

module.exports = {
    startTimer,
    stopTimer,
    updateTime: getUpdateTimerValue,
    resumeTimer,
    pauseTimer,
    displayMinutesAndSeconds
};
