const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const errorMessage = document.getElementById('error-message');

const sessionForm = document.getElementById('session-form');
const sessionNameInput = document.getElementById('session-name');
const sessionList = document.getElementById('session-list');
const sessionDetails = document.getElementById('session-details');
const selectedSessionName = document.getElementById('selected-session-name');

const driverForm = document.getElementById('driver-form');
const driverNameInput = document.getElementById('driver-name');
const carNumberSelect = document.getElementById('car-number');
const driverList = document.getElementById('driver-list');

let currentSessionId = null;

// Handle access key submission
accessForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'receptionist' });
});

// Handle key validation response
socket.on('key-validation', function(response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
        loadSessions(); // Load available race sessions
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// Handle race session creation
sessionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const sessionName = sessionNameInput.value;

    // Emit socket event to create a new session
    socket.emit('create-session', { sessionName });
    sessionNameInput.value = ''; // Clear the input after submission
});

// Handle session list updates
socket.on('session-list', function(sessions) {
    console.log('Received sessions:', sessions);  // Check if the data is being logged correctly
    if (Array.isArray(sessions)) {
        sessionList.innerHTML = ''; // Clear session list
        sessions.forEach(session => {
            const li = document.createElement('li');
            li.textContent = session.sessionName;
            li.addEventListener('click', () => selectSession(session.id, session.sessionName));
            sessionList.appendChild(li);
        });
    } else {
        console.error('Expected an array, but got:', sessions);
    }
});



// Select a session to manage drivers and cars
function selectSession(sessionId, sessionName) {
    currentSessionId = sessionId;
    selectedSessionName.textContent = sessionName;
    sessionDetails.style.display = 'block';
    loadDriversForSession(sessionId);
    loadAvailableCars(sessionId);
}

// Load drivers for the selected session
function loadDriversForSession(sessionId) {
    fetch(`/api/sessions/${sessionId}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            driverList.innerHTML = ''; // Clear the driver list
            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = `${driver.name} (Car: ${driver.carNumber})`;
                driverList.appendChild(li);
            });
        })
        .catch(error => console.error('Failed to load drivers:', error));
}

// Load available cars for the session (max 8)
function loadAvailableCars(sessionId) {
    fetch(`/api/sessions/${sessionId}/available-cars`)
        .then(response => response.json())
        .then(cars => {
            carNumberSelect.innerHTML = ''; // Clear car options
            cars.forEach(car => {
                const option = document.createElement('option');
                option.value = car.number;
                option.textContent = `Car ${car.number}`;
                carNumberSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Failed to load available cars:', error));
}

// Handle adding/updating drivers within the selected session
driverForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const driverName = driverNameInput.value;
    const carNumber = carNumberSelect.value;

    // Emit socket event to add a new driver to the session
    socket.emit('add-driver', { sessionId: currentSessionId, driverName, carNumber });
    
    driverNameInput.value = ''; // Clear inputs
    carNumberSelect.value = ''; 
    loadDriversForSession(currentSessionId); // Reload drivers
});

// Function to load available sessions and display them
function loadSessions() {
    fetch('/api/sessions')
        .then(response => response.json())
        .then(sessions => {
            const sessionList = document.getElementById('session-list');
            sessionList.innerHTML = '';  // Clear the session list

            sessions.forEach(session => {
                const li = document.createElement('li');
                li.textContent = session.sessionName;  // Display session name
                sessionList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading sessions:', error);
        });
}
