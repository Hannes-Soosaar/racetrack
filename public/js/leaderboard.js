const socket = io();

const timerContainer = document.getElementById('race-timer');
const raceFlag = document.getElementById('race-flag');
const leaderBoard = document.getElementById('leaderboard');
const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen();
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.style.display = 'none';
    } else {
        fullscreenBtn.style.display = '';
    }
});

// This page only listens and displays.
let cars = "no race started"

socket.on('connect', () => {
    console.log('Connected to WebSocket server leaderboard');
    displayLeaderBoard(cars);
});

//This is to display 
socket.on('time-update', (raceTimeElapse) => {
    displayMessage(raceTimeElapse);
});

socket.on(`update-leader-board`, (cars) => {
    displayLeaderBoard(cars);
});

socket.on('race-flags-update', (data) => {
    switch (data) {
        case 1:
            raceFlag.classList.remove('chequered');
            raceFlag.style.backgroundColor = 'green';
            break
        case 2:
            raceFlag.classList.remove('chequered');
            raceFlag.style.backgroundColor = 'red';
            break
        case 5:
            raceFlag.classList.remove('chequered');
            raceFlag.style.backgroundColor = 'yellow';
            break
        case 3:
            raceFlag.style.backgroundColor = '';
            raceFlag.classList.add('chequered');
            displayMessage("00:00");
            displayLeaderBoard(0);
            break
        default:
            raceFlag.style.backgroundColor = ''; // Reset background color
            raceFlag.classList.remove('chequered');
            break
    }
})

function displayMessage(value) {
    timerContainer.innerHTML = `<p>${value}</p>`;
};

function displayLeaderBoard(cars) {
    if (cars === 0) {
        leaderBoard.innerHTML = "Waiting for the Next Race to start!";
    } else {
        leaderBoard.innerHTML = "";
        let table = "<table><thead><tr><th>Car Number</th><th>Driver Name</th><th>Laps</th><th>Best Lap Time</th></tr></thead><tbody>";
        cars.forEach(car => {
            table += `
            <tr>
                <td>${car.number}</td>
                <td>${car.driver_name}</td>
                <td>${car.race_lap}</td>
                <td>${car.best_lap_time ? displayMinutesAndSeconds(car.best_lap_time) : '-'}</td>   <!-- Format best lap time -->
            </tr>
        `;
        });
        table += "</tbody></table>";
        leaderBoard.innerHTML = table;
    }
}

function displayMinutesAndSeconds(remainingRaceTime) {
    const totalSeconds = Math.floor(remainingRaceTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes} m :${formattedSeconds} s`;
}