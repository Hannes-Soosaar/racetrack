const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const errorMessage = document.getElementById('error-message');
const startRaceButton = document.getElementById('start-race');
const pauseRaceButton = document.getElementById('pause-race');
const endRaceButton = document.getElementById('end-race');
const raceModeDisplay = document.getElementById('race-mode');

// Handle access key submission
accessForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'safety' });
});

// Handle key validation response
socket.on('key-validation', function(response) {
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
});

// Pause race
pauseRaceButton.addEventListener('click', () => {
    console.log('Pause Race button clicked');
    socket.emit('change-mode', 'Pause');
});

// End race
endRaceButton.addEventListener('click', () => {
    console.log('End Race button clicked');
    socket.emit('end-race');
    // Not tied to the BE 
    // updateRace(stirng id)

});

// Update race mode display
socket.on('race-mode', (mode) => {
    raceModeDisplay.textContent = mode;
});

// Handle race status updates
socket.on('race-status', (status) => {
    raceModeDisplay.textContent = status;
});
