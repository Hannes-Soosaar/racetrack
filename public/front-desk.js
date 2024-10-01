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
const driverList = document.getElementById('driver-list');

// Handle access key submission
accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'receptionist' });
});

// Handle form submission for creating/updating a race
raceForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const id = raceIdInput.value;
    const session_name = sessionNameInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const status = 'upcoming'; // Default status

    const raceData = { session_name, date, time, status };

    // Emit event to create a race via Socket.IO
    socket.emit('create-race', raceData, (response) => {
        if (response.error) {
            alert(response.error);  // Show error (e.g., "Race name already exists")
        } else {
            raceForm.reset();
            loadRaces();  // Reload races
        }
    });
});

// Handle key validation response
socket.on('key-validation', function (response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
        loadRaces();  // Load races when the key is validated
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// Load races via Socket.IO
function loadRaces() {
    socket.emit('get-races', (races) => {
        console.log('Races response:', races);  // Log the races response

        if (!Array.isArray(races)) {
            console.error('Expected races to be an array but got:', races);
            return;  // Prevent further execution if races is not an array
        }

        const raceList = document.getElementById('race-list');
        raceList.innerHTML = '';  // Clear existing races

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
                    <select id="car-number-${race.id}" required></select>
                    <button type="submit">Save Driver</button>
                </form>
                <ul id="driver-list-${race.id}"></ul>
            `;
            raceList.appendChild(raceItem);

            // Load available cars and drivers for the race
            loadAvailableCars(race.id);
            loadDriversForRace(race.id);
        });
    });
}


// Load drivers for a specific race via Socket.IO
function loadDriversForRace(raceId) {
    socket.emit('get-drivers', raceId, (response) => {
        const driverList = document.getElementById(`driver-list-${raceId}`);
        
        console.log("Drivers response:", response);  // Debugging to check the response
        
        // Ensure the driver list element exists
        if (!driverList) {
            console.error(`Driver list element for race ${raceId} not found.`);
            return;
        }
        
        driverList.innerHTML = '';  // Clear the list before appending new items
        
        // Ensure that drivers is an array before using .forEach()
        if (Array.isArray(response.drivers)) {
            response.drivers.forEach(driver => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${driver.first_name} ${driver.last_name} (Car: ${driver.car_number})
                    <button onclick="deleteDriver(${raceId}, ${driver.id})">Delete</button>
                `;
                driverList.appendChild(li);
            });
        } else {
            console.error("Expected an array of drivers, but got:", response.drivers);
        }
    });
}


// Add a driver to a specific race via Socket.IO
function addDriverToRace(event, raceId) {
    event.preventDefault();

    const firstName = document.getElementById(`first-name-${raceId}`).value;
    const lastName = document.getElementById(`last-name-${raceId}`).value;
    const carNumber = document.getElementById(`car-number-${raceId}`).value;

    const driverData = { firstName, lastName, carNumber };

    socket.emit('add-driver', { raceId, driverData }, (response) => {
        if (response.error) {
            alert(response.error);  // Show any error
        } else {
            loadDriversForRace(raceId);  // Reload drivers after adding
        }
    });
}


function editRace(raceId) {
    // Emit an event to fetch the race details via Socket.IO
    socket.emit('get-race-details', raceId, (response) => {
        if (response.error) {
            console.error(`Error fetching race ${raceId}:`, response.error);
        } else {
            const race = response.race;
            // Populate the form fields with the race data
            document.getElementById('race-id').value = race.id;  // Ensure race ID is populated
            document.getElementById('session-name').value = race.session_name;
            document.getElementById('date').value = race.date;
            document.getElementById('time').value = race.time;
        }
    });
}

// Delete a race via Socket.IO
function deleteRace(raceId) {
    if (!confirm('Are you sure you want to delete this race?')) {
        return;
    }

    socket.emit('delete-race', raceId, (response) => {
        if (response.error) {
            alert('Error deleting race: ' + response.error);
        } else {
            loadRaces();  // Reload races after deletion
        }
    });
}

// Delete a driver from a specific race via Socket.IO
function deleteDriver(raceId, driverId) {
    if (!confirm('Are you sure you want to delete this driver from the race?')) {
        return;
    }

    socket.emit('delete-driver', { raceId, driverId }, (response) => {
        if (response.error) {
            alert('Error deleting driver: ' + response.error);
        } else {
            loadDriversForRace(raceId);  // Reload drivers after deletion
        }
    });
}

// Load available cars for a race
function loadAvailableCars(raceId) {
    socket.emit('get-available-cars', raceId, (cars) => {
        const carNumberSelect = document.getElementById(`car-number-${raceId}`);

        if (!carNumberSelect) {
            console.error(`Car select element for race ${raceId} not found.`);
            return;
        }

        carNumberSelect.innerHTML = '';  // Clear previous options

        if (cars.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No available cars';
            carNumberSelect.appendChild(option);
            return;
        }

        cars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.number;  // Use car number as the value
            option.textContent = `Car ${car.number}`;  // Display car number
            carNumberSelect.appendChild(option);
        });
    });
}


document.addEventListener('DOMContentLoaded', function () {
    loadRaces();  // Call loadRaces when the page loads
});
