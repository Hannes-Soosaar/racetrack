const db = require("../../config/db.js");

let timerInterval;
let racePaused = false;
let raceInProgress = false;
let pauseDuration = 0;
let pauseStart = 0;
let remainingRaceTime = 0;
let startTime = 0;
let storedTimer;

async function startTimer(io, raceDurationMs) {
    try {
        storedTimer = await getStoredTimer();
        console.log("Stored Timer", storedTimer);
        if (storedTimer > 0) {
            console.log("Trying to set the")
            raceDurationMs = storedTimer;
        }
    } catch (error) {
        console.log(` error getting time from timer :`, error);
    }

    if (raceInProgress) {
        console.log("Race already started!");
        return;
    }
    console.log("The race duration is:" + raceDurationMs);
    let remainingRaceTime = raceDurationMs;
    startTime = Date.now();
    raceInProgress = true;
    timerInterval = setInterval(() => {
        if (racePaused) return;
        const elapsedTime = Date.now() - startTime - pauseDuration;
        remainingRaceTime = raceDurationMs - elapsedTime;
        if (remainingRaceTime <= 0) {
            remainingRaceTime = 0;
            clearInterval(timerInterval);
            raceInProgress = false;

            io.emit('trigger-end-race')
        }
        raceTimeElapse = displayMinutesAndSeconds(remainingRaceTime);
        io.emit('time-update', raceTimeElapse);
        getUpdateTimerValue(remainingRaceTime);
        setTimerToDb(remainingRaceTime);
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
    startTime = 0;
    console.log("Race ended");
    setTimerToDb(0);
}
function getUpdateTimerValue() {
    return remainingRaceTime;
}

function getRaceStartTime() {
    return startTime;
}

function displayMinutesAndSeconds(remainingRaceTime) {
    const totalSeconds = Math.floor(remainingRaceTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getStoredTimer() {
    const query = `SELECT timer FROM timer WHERE id=1`;
    let remainingSavedRaceTime;
    try {
        remainingSavedRaceTime = await dbGet(query);
    } catch (error) {
        console.log(` error getting remaining to DB : `, error);
    }
    console.log("this is what the data looks like", remainingSavedRaceTime.timer)
    return Number(remainingSavedRaceTime.timer);
}

async function setTimerToDb(timeInMs) {
    const query = `UPDATE timer SET timer = ? WHERE id =1`
    try {
        dbRun(query, [Number(timeInMs)])
    } catch (error) {
        console.log(` error setting timer to DB : `, error);
    }
}


async function dbGet(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

async function dbRun(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

module.exports = {
    startTimer,
    stopTimer,
    updateTime: getUpdateTimerValue,
    resumeTimer,
    pauseTimer,
    displayMinutesAndSeconds,
    getUpdateTimerValue,
    getRaceStartTime,
    setTimerToDb,

};
