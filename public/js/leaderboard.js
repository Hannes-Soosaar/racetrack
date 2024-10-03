const socket = io();
const timerContainer = document.getElementById('race-timer');
const leaderBoard = document.getElementById('leaderboard');
const raceFlag = document.getElementById('race-flag');
// This page only listens and displays.

socket.on('connect', () => {
    console.log('Connected to WebSocket server leaderboard'); // reaches and works
    socket.emit('leaderboard-connecter','leaderboard-connected');
});

// This is to display 
socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
});

socket.on('peak', (text) => {
    displayMessage(text);
});

socket.on('update-leader-board', (leaderBoard) => {
    displayMessage(leaderBoard); //TODO: create a new function to manipulate the DOM.
})

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
}

