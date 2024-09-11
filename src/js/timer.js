let timerInterval;
let racePaused = false;
let raceInProgress = false;
let pauseDuration = 0;
let pauseStart = 0;

// Toggle fro this needs to be a io socket.
function startTimer(raceDurationMs) {
    let remainingRaceTime = raceDurationMs
    const startTime = Date.now();

    timerInterval = setInterval(() => {
        if (racePaused) return;

        const elapsedTime = Date.now() - startTime - pauseDuration; // ! Check this logic 
        remainingRaceTime = raceDurationMs - elapsedTime;

        if (remainingRaceTime <= 0) {
            remainingRaceTime = 0;
            clearInterval(timerInterval);
            raceInProgress = false;
        }

        updateTime(remainingRaceTime);
    }, 100);
}

function PauseTimer() {
    if (raceInProgress && !racePaused) {
        racePaused = true;
        pauseStart = true;
        console.log("Race paused");
    }
}

function resumeTimer(){
    if(raceInProgress && racePaused){
        racePaused = false;
        pauseDuration +=  Date.now()-pauseStart;
        console.log("Race resumed")
    }
}

// ? this might require some way of getting the time the races was ended.
function stopTimer() {
    clearInterval(timerInterval);
    raceInProgress = false;
    racePaused =false;
    pauseDuration = 0;
    console.log("Race ended")
}

// used to extract the current timer information from the loop 
function updateTime(remainingRaceTime) {
    console.log("there are ms left in the race", remainingRaceTime)
    return remainingRaceTime;
}


module.exports = {
    startTimer,
    stopTimer,
    updateTime,
    resumeTimer,
    PauseTimer
};
