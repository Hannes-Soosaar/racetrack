//TODO: Race timer functions.

function startTimer(raceDurationMs) {
    console.log("timer Started!")
    let remainingRaceTime = raceDurationMs
    const startTime = Date.now();
    console.log(startTime);
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        remainingRaceTime -= elapsedTime;
        if (remainingRaceTime <= 0) {
            remainingRaceTime = 0;
            clearInterval(timerInterval);
        }
        updateTime(remainingRaceTime);
    }, 500);
}


function PauseTimer(remainingRaceTime){

    
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTime(remainingRaceTime){
    console.log("there is  ms left in the race", remainingRaceTime)
}

module.exports = {
    startTimer,
    stopTimer
};


// sets the race start time as Date.now. when resuming it will take race Start Time - Date now and compare it to the allowed race time.