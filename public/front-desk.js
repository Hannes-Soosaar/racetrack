const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const errorMessage = document.getElementById('error-message');

// Form elements for managing races
const raceForm = document.getElementById('race-form');
const raceIdInput = document.getElementById('race-id');
const sessionNameInput = document.getElementById('session-name');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const statusInput = document.getElementById('status');
const raceList = document.getElementById('race-list');

// Form elements for managing drivers
const driverForm = document.getElementById('driver-form');
const driverIdInput = document.getElementById('driver-id');
const firstNameInput = document.getElementById('first-name');  
const lastNameInput = document.getElementById('last-name');    
const carNumberSelect = document.getElementById('car-number');
const driverList = document.getElementById('driver-list');

// Handle access key submission
accessForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'receptionist' });
});

// Handle form submission for creating/updating a race
raceForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent page reload

    const id = raceIdInput.value;
    const session_name = sessionNameInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const status = 'upcoming';  // Assuming default status for a new race

    const method = id ? 'PUT' : 'POST';  
    const url = id ? `/api/races/${id}` : '/api/races';  

    const data = { session_name, date, time, status };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        raceForm.reset();  
        loadRaces();       
    })
    .catch(error => {
        console.error('Error saving race session:', error);
    });
});

// Handle key validation response
socket.on('key-validation', function(response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
        loadRaces();  
        loadAvailableCars();
        loadDrivers();
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// Load available cars for assigning to drivers
function loadAvailableCars() {
    fetch('/api/cars')
        .then(response => response.json())
        .then(cars => {
            carNumberSelect.innerHTML = '';  
            cars.forEach(car => {
                const option = document.createElement('option');
                option.value = car.number;
                option.textContent = `Car ${car.number} - ${car.name}`;
                carNumberSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading cars:', error));
}

// Fetch and display the list of races
function loadRaces() {
    fetch('/api/races')  
        .then(response => response.json())
        .then(races => {
            const raceList = document.getElementById('race-list');  
            raceList.innerHTML = '';  

            races.forEach(race => {
                const raceItem = document.createElement('div');
                raceItem.innerHTML = `
                    <strong>${race.session_name}</strong> - ${race.date} ${race.time}
                    <button onclick="editRace(${race.id})">Edit Race</button>
                    <button onclick="deleteRace(${race.id})">Delete Race</button>

                    <h3>Add Drivers to ${race.session_name}</h3>
                    <form onsubmit="addDriverToRace(event, ${race.id})">
                        <label for="first-name-${race.id}">First Name:</label>
                        <input type="text" id="first-name-${race.id}" required>
                        
                        <label for="last-name-${race.id}">Last Name:</label>
                        <input type="text" id="last-name-${race.id}" required>

                        <label for="car-number-${race.id}">Car Number:</label>
                        <select id="car-number-${race.id}" required>
                            <!-- Populate cars here -->
                        </select>

                        <button type="submit">Save Driver</button>
                    </form>
                    <ul id="driver-list-${race.id}"></ul> 
                `;

                raceList.appendChild(raceItem);

                // Load drivers for this race (if any exist)
                loadDriversForRace(race.id);  // Ensure this function is defined below
            });
        })
        .catch(error => {
            console.error('Error loading races:', error);
        });
}

// Fetch drivers for a specific race and display them
function loadDriversForRace(raceId) {
    fetch(`/api/races/${raceId}/drivers`)  
        .then(response => response.json())
        .then(drivers => {
            const driverList = document.getElementById(`driver-list-${raceId}`);
            driverList.innerHTML = '';  

            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = `${driver.first_name} ${driver.last_name} (Car: ${driver.carNumber})`;
                driverList.appendChild(li);
            });
        })
        .catch(error => {
            console.error(`Error loading drivers for race ${raceId}:`, error);
        });
}

// Add a driver to a specific race
function addDriverToRace(event, raceId) {
    event.preventDefault();

    const firstName = document.getElementById(`first-name-${raceId}`).value;
    const lastName = document.getElementById(`last-name-${raceId}`).value;
    const carNumber = document.getElementById(`car-number-${raceId}`).value;

    const data = { firstName, lastName, carNumber };

    fetch(`/api/races/${raceId}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        loadDriversForRace(raceId);  
    })
    .catch(error => {
        console.error(`Error adding driver to race ${raceId}:`, error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadRaces();  // Call loadRaces when the page loads
});

// Load races function
function loadRaces() {
    fetch('/api/races')
        .then(response => response.json())
        .then(races => {
            const raceList = document.getElementById('race-list');
            raceList.innerHTML = '';  // Clear the existing list

            races.forEach(race => {
                const raceItem = document.createElement('div');
                raceItem.innerHTML = `
                    <strong>${race.session_name}</strong> - ${race.date} ${race.time}
                    <button onclick="editRace(${race.id})">Edit Race</button>
                    <button onclick="deleteRace(${race.id})">Delete Race</button>

                    <h3>Add Drivers to ${race.session_name}</h3>
                    <form onsubmit="addDriverToRace(event, ${race.id})">
                        <label for="first-name-${race.id}">First Name:</label>
                        <input type="text" id="first-name-${race.id}" required>
                        
                        <label for="last-name-${race.id}">Last Name:</label>
                        <input type="text" id="last-name-${race.id}" required>

                        <label for="car-number-${race.id}">Car Number:</label>
                        <select id="car-number-${race.id}" required>
                            <!-- Populate cars here -->
                        </select>

                        <button type="submit">Save Driver</button>
                    </form>
                    <ul id="driver-list-${race.id}"></ul> <!-- List of drivers for this race -->
                `;
                raceList.appendChild(raceItem);

                // Load drivers for this race
                loadDriversForRace(race.id);
            });
        })
        .catch(error => {
            console.error('Error loading races:', error);
        });
}


// Load drivers for a specific race
function loadDriversForRace(raceId) {
    fetch(`/api/races/${raceId}/drivers`)
        .then(response => response.json())
        .then(drivers => {
            const driverList = document.getElementById(`driver-list-${raceId}`);
            driverList.innerHTML = '';  // Clear existing drivers

            if (!Array.isArray(drivers)) {
                console.error('Expected an array of drivers, but got:', drivers);
                return;
            }

            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = `${driver.first_name} ${driver.last_name} (Car: ${driver.car_number})`;
                driverList.appendChild(li);
            });
        })
        .catch(error => {
            console.error(`Error loading drivers for race ${raceId}:`, error);
        });
}

function loadDrivers() {
    // Add logic to load drivers
    fetch('/api/drivers')
        .then(response => response.json())
        .then(drivers => {
            console.log('Drivers loaded:', drivers);
            // You can populate driver details here
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
        });
}

function deleteRace(raceId) {
    if (!confirm('Are you sure you want to delete this race?')) {
        return;
    }

    fetch(`/api/races/${raceId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete race');
        }
        loadRaces();  // Reload races after deletion
    })
    .catch(error => {
        console.error(`Error deleting race ${raceId}:`, error);
    });
}

function editRace(raceId) {
    // You can fetch the details of the race you want to edit here and pre-fill the form.
    fetch(`/api/races/${raceId}`)
    .then(response => response.json())
    .then(race => {
        // Populate the form fields with the race data
        document.getElementById('race-id').value = race.id;
        document.getElementById('session-name').value = race.session_name;
        document.getElementById('date').value = race.date;
        document.getElementById('time').value = race.time;
    })
    .catch(error => console.error(`Error fetching race ${raceId}:`, error));
}


