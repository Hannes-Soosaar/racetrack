const socket = io();

const timerContainer = document.getElementById('race-timer');

socket.on('connect', () => {
    console.log('Connected to WebSocket server race-Timer'); // reaches and works
});

socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
});

socket.on('stop-timer', () => {
    displayMessage("00:00");
});

function displayMessage(value) {
    timerContainer.innerHTML = `<p>${value}</p>`;
}
