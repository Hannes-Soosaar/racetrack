const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const newSessionDiv = document.getElementById('session-content')
const newSessionButton = document.getElementById('see-new-session')
const contentDiv = document.getElementById('content');
const contentDivAfterStart = document.getElementById('content-after-start')
const contentDivAfterFinish = document.getElementById('content-after-finish')
const errorMessage = document.getElementById('error-message');
const startRaceButton = document.getElementById('start-race');
const modeSafeButton = document.getElementById('mode-safe');
const modeHazardButton = document.getElementById('mode-hazard');
const modeDangerButton = document.getElementById('mode-danger');
const endRaceButton = document.getElementById('end-race');
const finishSessionButton = document.getElementById('end-session')
const raceModeDisplay = document.getElementById('race-mode-start');
const raceInformationDiv = document.getElementById('race-information')

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
        newSessionDiv.style.display = 'block'
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

//TODO: currently just shows the race info, needs to be changed to show driver and what car they drive
socket.on('display-race', (race) => {
    raceInformationDiv.innerHTML = '';

    for (const [key, value] of Object.entries(race)) {
        const paragraph = document.createElement('p');
        paragraph.textContent = `${key}: ${value}`;
        raceInformationDiv.appendChild(paragraph);
    }
})

newSessionButton.addEventListener('click', () => {
    socket.emit('start-session');
    contentDiv.style.display = 'block';
    newSessionDiv.style.display = 'none'
});

// Start race
startRaceButton.addEventListener('click', () => {
    console.log('Start Race button clicked');
    socket.emit('start-race');
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
});

finishSessionButton.addEventListener('click', () => {
    socket.emit('end-session')
});

socket.on('race-status', (status) => {
    console.log('Received race status:', status);
    // Update the UI with the new race status
    document.getElementById('race-status-display').innerText = status;
    if (status === 'No upcoming race found') {
        contentDiv.style.display = 'block'
        contentDivAfterStart.style.display = 'none'
    } else {
        contentDiv.style.display = 'none'
        contentDivAfterStart.style.display = 'block'
        document.getElementById('race-status-display-2').innerText = status;
    }
});

socket.on('race-status', (status) => {
    if (status === 'Race ended') {
        disableButtons()
        contentDivAfterFinish.style.display = 'block'
    }
})

function disableButtons() {
    document.getElementById('mode-safe').disabled = true
    document.getElementById('mode-hazard').disabled = true
    document.getElementById('mode-danger').disabled = true
    document.getElementById('end-race').disabled = true
}

function enableButtons() {
    document.getElementById('mode-safe').disabled = false
    document.getElementById('mode-hazard').disabled = false
    document.getElementById('mode-danger').disabled = false
    document.getElementById('end-race').disabled = false
}

