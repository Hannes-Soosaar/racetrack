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
        const raceList = document.getElementById('race-list');
        raceList.innerHTML = '';  // Clear existing races

        races.forEach(race => {
            const raceItem = document.createElement('div');
            raceItem.setAttribute('data-race-id', race.id);  // Add data-race-id for easier DOM manipulation

            const isSafeToStart = (race.status === 'safe_to_start' || race.status === 'started');

            raceItem.innerHTML = `
                <strong>${race.session_name}</strong> - ${race.date} ${race.time}
                <button onclick="editRace(${race.id})" ${isSafeToStart ? 'disabled' : ''}>Edit Race</button>
                <button onclick="deleteRace(${race.id})" ${isSafeToStart ? 'disabled' : ''}>Delete Race</button>
                <h3>Add Drivers to ${race.session_name}</h3>
                <form onsubmit="addDriverToRace(event, ${race.id})" ${isSafeToStart ? 'style="display:none;"' : ''}>
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
            loadDriversForRace(race.id, isSafeToStart);
        });
    });
}

// Modify loadDriversForRace to handle disabling based on race status
function loadDriversForRace(raceId, isSafeToStart) {
    socket.emit('get-drivers', raceId, (response) => {
        const driverList = document.getElementById(`driver-list-${raceId}`);
        driverList.innerHTML = '';  // Clear the list before appending new items

        response.drivers.forEach(driver => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${driver.first_name} ${driver.last_name} (Car: ${driver.car_number})
                ${isSafeToStart ? '' : `<button onclick="editDriver(${raceId}, ${driver.id}, '${driver.first_name}', '${driver.last_name}', ${driver.car_number})">Edit</button>
                <button onclick="deleteDriver(${raceId}, ${driver.id})">Delete</button>`}
            `;
            driverList.appendChild(li);
        });
    });
}



// Add the markRaceSafeToStart function here
function markRaceSafeToStart(raceId) {
    if (!confirm('Are you sure you want to mark this race as safe to start? This will lock the race from further editing.')) {
        return;
    }

    // Emit socket event to mark race as safe to start
    socket.emit('mark-safe-to-start', raceId, (response) => {
        if (response.error) {
            alert('Error marking race as safe to start: ' + response.error);
        } else {
            alert('Race marked as safe to start!');
            loadRaces();  // Reload races to reflect the updated status
        }
    });
}



// Show edit form for driver
function editDriver(raceId, driverId, firstName, lastName, carNumber) {
    document.getElementById('edit-driver-id').value = driverId;
    document.getElementById('edit-first-name').value = firstName;
    document.getElementById('edit-last-name').value = lastName;
    document.getElementById('edit-car-number').value = carNumber;
    document.getElementById('edit-driver-form').onsubmit = (event) => {
        event.preventDefault();
        updateDriverInRace(raceId, driverId);
    };
    document.getElementById('edit-driver-modal').style.display = 'block';  // Show the modal for editing

    socket.emit('g-n-r-s')
}

// Update driver information in the race
function updateDriverInRace(raceId, driverId) {
    const firstName = document.getElementById('edit-first-name').value;
    const lastName = document.getElementById('edit-last-name').value;
    const carNumber = document.getElementById('edit-car-number').value;

    const driverData = { firstName, lastName, carNumber };

    socket.emit('edit-driver', { raceId, driverId, driverData }, (response) => {
        if (response.error) {
            alert(response.error);
        } else {
            loadDriversForRace(raceId);  // Reload drivers after updating
            closeEditDriverModal();  // Close the modal after editing
        }
    });

    socket.emit('g-n-r-s')
}

// Close the edit driver modal
function closeEditDriverModal() {
    document.getElementById('edit-driver-modal').style.display = 'none';
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

    socket.emit('g-n-r-s')
}


function editRace(raceId) {
    // Emit an event to fetch the race details via Socket.IO
    socket.emit('get-race-details', raceId, (response) => {
        if (response.error) {
            console.error(`Error fetching race ${raceId}:`, response.error);
        } else {
            const race = response.race;
            // Populate modal form fields with the race data
            document.getElementById('edit-race-id').value = race.id;  // Set hidden race ID field
            document.getElementById('edit-session-name').value = race.session_name;
            document.getElementById('edit-date').value = race.date;
            document.getElementById('edit-time').value = race.time;

            // Show the modal for editing
            document.getElementById('edit-race-modal').style.display = 'block';
        }
    });
}


function updateRace(event) {
    event.preventDefault();  // Prevent form submission

    const raceId = document.getElementById('edit-race-id').value;
    const sessionName = document.getElementById('edit-session-name').value;
    const date = document.getElementById('edit-date').value;
    const time = document.getElementById('edit-time').value;

    const updatedRaceData = {
        session_name: sessionName,
        date: date,
        time: time
    };

    socket.emit('edit-race', raceId, updatedRaceData, (response) => {
        if (response.error) {
            alert('Error updating race: ' + response.error);
        } else {
            alert('Race updated successfully!');
            loadRaces();  // Reload the races
            closeEditModal();  // Close the modal
        }
    });
}

function closeEditModal() {
    document.getElementById('edit-race-modal').style.display = 'none';
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

    socket.emit('g-n-r-s')
}

// Delete a driver from a specific race via Socket.IO
function deleteDriver(raceId, driverId) {
    if (!confirm('Are you sure you want to delete this driver from the race?')) {
        return;
    }

    socket.emit('remove-driver', { raceId, driverId }, (response) => {
        if (response.error) {
            alert('Error deleting driver: ' + response.error);
        } else {
            loadDriversForRace(raceId);  // Reload drivers after deletion
        }
    });

    socket.emit('g-n-r-s')
}


// Load available cars for a race
function loadAvailableCars(raceId) {
    const carNumberSelect = document.getElementById(`car-number-${raceId}`);

    // Check if the select element exists before proceeding
    if (!carNumberSelect) {
        console.error(`Car select element for race ${raceId} not found.`);
        return;  // Exit function if element is not found
    }
    socket.emit('get-available-cars', raceId, (cars) => {
        const carNumberSelect = document.getElementById(`car-number-${raceId}`);

        // Ensure the select element exists
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



socket.on('block-driver-changes', id => {
    const buttons = document.querySelectorAll('button')
    const targetButtons = Array.from(buttons).filter(button => {
        return button.getAttribute('onclick') && button.getAttribute('onclick').includes(id)
    })

    targetButtons.forEach(button => {
        button.disabled = true
    })

    console.log('blocking driver changes for id: ', id)
})

document.addEventListener('DOMContentLoaded', function () {
    loadRaces();  // Call loadRaces when the page loads
});

// Handle updates to race status
socket.on('race-status-updated', ({ raceId, status }) => {
    if (status === 'safe_to_start') {
        console.log(`Race ${raceId} is now safe to start`);
        loadRaces();  // Reload races to reflect the new status
    }
    if (status === 'started') {
        console.log(`Race ${raceId} has started`);
        removeRaceFromList(raceId);  // Remove the race from the list without reloading the entire page
    }
});

// Function to remove race from the list by raceId
function removeRaceFromList(raceId) {
    const raceItem = document.querySelector(`#race-list div[data-race-id="${raceId}"]`);
    if (raceItem) {
        raceItem.remove();  // Remove the race from the DOM
    }
}

// Handle disabling driver addition when the race is marked as "safe to start"
socket.on('block-driver-addition', (raceId) => {
    const addDriverForm = document.querySelector(`form[onsubmit*="addDriverToRace(event, ${raceId})"]`);
    if (addDriverForm) {
        const inputs = addDriverForm.querySelectorAll('input, select, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }
});

// Dynamically populate the time dropdown in 10-minute intervals
function populateTimeDropdown() {
    const timeDropdown = document.getElementById('time');

    // Loop through hours (0-23) and minutes (0, 10, 20, ... 50)
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
            const option = document.createElement('option');

            // Format the hour and minute to always be two digits (e.g., 00:00, 01:10)
            const hourFormatted = String(hour).padStart(2, '0');
            const minuteFormatted = String(minute).padStart(2, '0');

            // Set the option value and text (e.g., "01:10")
            option.value = `${hourFormatted}:${minuteFormatted}`;
            option.textContent = `${hourFormatted}:${minuteFormatted}`;

            // Add the option to the dropdown
            timeDropdown.appendChild(option);
        }
    }
}

// Call the function to populate the time dropdown when the page loads
document.addEventListener('DOMContentLoaded', populateTimeDropdown);


