const socket = io();

const timerContainer = document.getElementById('race-timer');
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

socket.on('connect', () => {
    console.log('Connected to WebSocket server race-Timer'); // reaches and works
    socket.emit('get-continuing-session')
});

socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
    console.log('race-countdown.js')
});

socket.on('stop-timer', () => {
    displayMessage("00:00");
});

socket.on('reload', () => {
    location.reload()
})

function displayMessage(value) {
    timerContainer.innerHTML = `<p>${value}</p>`;
}
