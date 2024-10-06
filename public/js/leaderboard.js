const socket = io();

const timerContainer = document.getElementById('race-timer');
const raceFlag = document.getElementById('race-flag');
const leaderBoard = document.getElementById('leaderboard');
// This page only listens and displays.
let cars = "cars not set yet!"
socket.on('connect', () => {
    console.log('Connected to WebSocket server leaderboard'); // reaches and works
    socket.emit('leaderboard-connecter', 'leaderboard-connected');
});

// This is to display 
socket.on('time-update', (raceTimeElapse) => {
    console.log("The time we got", raceTimeElapse);
    displayMessage(raceTimeElapse);
});

// socket.on('peak', (text) => {
//     displayMessage(text);
// });

// socket.on('update-leader-board', async(leaderBoard) => {
//     try{
//         await displayLeaderBoard(leaderBoard);
//         console.log("We got the cars", leaderBoard);//TODO: create a new function to manipulate the DOM.
//     } catch{
//         console.log('error with getting the cars!')
//     }
// });


socket.on(`update-leader-board`, (cars) => {
    console.log('Leaderboard updated', cars);
    displayLeaderBoard(cars);
});



//TODO use constant to pass in cases as words.
socket.on('race-flags-update', (data) => {
    switch (data) {
        case 1:
            raceFlag.classList.remove('chequered')
            raceFlag.style.backgroundColor = 'green'
            break
        case 2:
            raceFlag.classList.remove('chequered')
            raceFlag.style.backgroundColor = 'red'
            break
        case 5:
            raceFlag.classList.remove('chequered')
            raceFlag.style.backgroundColor = 'yellow'
            break
        case 3:
            raceFlag.style.backgroundColor = ''
            raceFlag.classList.add('chequered')
            break
        default:
            raceFlag.style.backgroundColor = '' // Reset background color
            raceFlag.classList.remove('chequered')
            break
    }
})

function displayMessage(value) {
    timerContainer.innerHTML = `<p>${value}</p>`;
};

function displayLeaderBoard(cars) {
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

function displayMinutesAndSeconds(remainingRaceTime) {
    const totalSeconds = Math.floor(remainingRaceTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes} m :${formattedSeconds} s`;
}


