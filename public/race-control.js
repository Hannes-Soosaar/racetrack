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


socket.on('display-race', (driverInfo) => {
    contentDiv.style.display = 'block'
    newSessionDiv.style.display = 'none'

    raceInformationDiv.innerHTML = '';

    driverInfo.forEach(driver => {
        const paragraph = document.createElement('p');
        paragraph.textContent = `Driver: ${driver.driver_name}, Car Number: ${driver.car_number}`;
        raceInformationDiv.appendChild(paragraph);
    })
})

newSessionButton.addEventListener('click', () => {
    socket.emit('start-session');
    socket.emit('load-leaderboard'); //! do we want to trigger the load here ?
});

// reply to get-race-id
// socket.on('set-race-id', (raceId) => {
//     // socket.emit('race-id', raceId);
// });

startRaceButton.addEventListener('click', () => {
    console.log('Start Race button clicked');
    socket.emit('start-race');
    socket.emit('change-mode', 'Safe')
    socket.emit('start-timer');
});

modeSafeButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Safe'
    console.log('Race mode: Safe');
    socket.emit('change-mode', 'Safe');
    socket.emit('resume-timer');
})

modeHazardButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Hazard'
    console.log('Race mode: Hazard');
    socket.emit('change-mode', 'Hazard');
    socket.emit('pause-timer');
})

modeDangerButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Danger'
    console.log('Race mode: Danger');
    socket.emit('change-mode', 'Danger');
    socket.emit('pause-timer');
})

endRaceButton.addEventListener('click', () => {
    raceModeDisplay.textContent = 'Finish'
    console.log('End Race button clicked');
    socket.emit('end-race');
    socket.emit('stop-timer');
});

socket.on('trigger-end-race', () => {
    socket.emit('end-race')
})

finishSessionButton.addEventListener('click', () => {
    socket.emit('end-session')
});

socket.on('race-status', (status) => {
    console.log('Received race status:', status);
    document.getElementById('race-status-display').innerText = status;
    if (status === 'No upcoming race found') {
        contentDiv.style.display = 'none'
        contentDivAfterStart.style.display = 'none'
        newSessionDiv.style.display = 'block'
        document.getElementById('race-status-display-session').innerText = status
    } else if (status === 'Race not started') {
        document.getElementById('race-status-display').innerText = status
    } else if (status === 'Race ended') {
        disableButtons()
        contentDivAfterStart.style.display = 'none'
        contentDivAfterFinish.style.display = 'block'
    } else if (status === 'Race started') {
        raceModeDisplay.textContent = 'Safe'
        contentDiv.style.display = 'none'
        contentDivAfterStart.style.display = 'block'
        document.getElementById('race-status-display-2').innerText = status;
    } else if (status === 'Session ended') {
        contentDivAfterFinish.style.display = 'none'
        contentDiv.style.display = 'none'
        contentDivAfterStart.style.display = 'none'
        newSessionDiv.style.display = 'block'
        document.getElementById('race-status-display-session').innerText = status
        enableButtons()
    }
});

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


