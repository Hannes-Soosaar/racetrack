const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const contentDivAfterStart = document.getElementById('content-after-start')
const errorMessage = document.getElementById('error-message');
const startRaceButton = document.getElementById('start-race');
const modeSafeButton = document.getElementById('mode-safe');
const modeHazardButton = document.getElementById('mode-hazard');
const modeDangerButton = document.getElementById('mode-danger');
const endRaceButton = document.getElementById('end-race');
const raceModeDisplay = document.getElementById('race-mode-start');

// Handle access key submission
accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'safety' });
});

// Handle key validation response
socket.on('key-validation', function (response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// Start race
startRaceButton.addEventListener('click', () => {
    console.log('Start Race button clicked');
    socket.emit('start-race');
    contentDiv.style.display = 'none'
    contentDivAfterStart.style.display = 'block'
});

modeSafeButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Safe'
    console.log('Race mode: Safe');
    socket.emit('change-mode', 'Safe')
})

modeHazardButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Hazard'
    console.log('Race mode: Hazard');
    socket.emit('change-mode', 'Hazard')
})

modeDangerButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Danger'
    console.log('Race mode: Danger');
    socket.emit('change-mode', 'Danger')
})

// End race
endRaceButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Finish'
    console.log('End Race button clicked');
    socket.emit('end-race');

    // Not tied to the BE 
    // updateRace(string id)

});

