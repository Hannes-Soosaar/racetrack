const socket = io();

const timerContainer = document.getElementById('race-timer');

socket.on('connect', () => {
    console.log('Connected to WebSocket server race-Timer'); // reaches and works
});

socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
});

function displayMessage(value) {
    timerContainer.innerHTML = `<p>${value}</p>`;
}
