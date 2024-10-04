const socket = io();
const nextRaceDiv = document.getElementById('nextRaceStatus');

// On connection to the server
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    socket.emit('public-view', 'next-race');
    socket.emit('get-next-race-status');
});

// Listen for updates to the next race status
socket.on('update-next-race', (nextRaceData) => {
    console.log(nextRaceData);
    nextRaceDiv.innerHTML = '';
    const paragraph = document.createElement('p');
    if (nextRaceData === null) {
        paragraph.textContent = 'Currently there are no scheduled races!';
        nextRaceDiv.appendChild(paragraph);
    } else {
        paragraph.textContent = 'Next race info:';
        nextRaceDiv.appendChild(paragraph);
        nextRaceData.forEach(driver => {
            const textLine = document.createElement('p');
            textLine.textContent = `Driver: ${driver.driver_name}, Car Number: ${driver.car_number}`;
            nextRaceDiv.appendChild(textLine);
        });
    }
});

// Handle race status update for Next Race display
socket.on('race-status-updated', ({ raceId, status }) => {
    if (status === 'safe_to_start') {
        loadNextRace(raceId);  // Show this race as the next race
    }
});

// Load next race details
function loadNextRace(raceId) {
    socket.emit('get-race-details', raceId, (response) => {
        if (response.error) {
            console.error('Error loading next race:', response.error);
        } else {
            const race = response.race;
            nextRaceDiv.innerHTML = '';  // Clear previous content
            const raceInfo = document.createElement('p');
            raceInfo.textContent = `Race: ${race.session_name}, Time: ${race.date} ${race.time}`;
            nextRaceDiv.appendChild(raceInfo);

            // Load drivers for the next race
            loadDriversForNextRace(raceId);
        }
    });
}

// Load drivers for the next race
function loadDriversForNextRace(raceId) {
    socket.emit('get-drivers', raceId, (response) => {
        if (response.error) {
            console.error('Error loading drivers:', response.error);
        } else {
            response.drivers.forEach(driver => {
                const driverInfo = document.createElement('p');
                driverInfo.textContent = `Driver: ${driver.first_name} ${driver.last_name}, Car Number: ${driver.car_number}`;
                nextRaceDiv.appendChild(driverInfo);
            });
        }
    });
}

// Trigger fetching next race status
socket.on('trigger-get-next-race-status', () => {
    socket.emit('get-next-race-status');
});

// Message for drivers to proceed to paddock
socket.on('trigger-next-race-message', () => {
    const driverMessage = document.createElement('p');
    driverMessage.textContent = 'Drivers, please proceed to the paddock';
    nextRaceDiv.appendChild(driverMessage);
});
