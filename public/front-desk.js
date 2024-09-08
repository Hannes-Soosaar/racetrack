const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const errorMessage = document.getElementById('error-message');
const driverForm = document.getElementById('driver-form');
const driverIdInput = document.getElementById('driver-id');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const statusInput = document.getElementById('status');
const driverList = document.getElementById('driver-list');
const carNumberSelect = document.getElementById('car-number');
const raceSessionForm = document.getElementById('race-session-form');
const raceDateInput = document.getElementById('race-date');
const raceSessionList = document.getElementById('race-session-list');

// Handle access key submission
accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'receptionist' });
});

// Handle key validation response
socket.on('key-validation', function (response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
        loadDrivers();
        loadAvailableCars();
        loadRaceSessions();
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// Load drivers from the server
function loadDrivers() {
    fetch('/api/drivers')
        .then(response => response.json())
        .then(drivers => {
            if (!Array.isArray(drivers)) {
                throw new Error('Expected an array of drivers');
            }
            driverList.innerHTML = '';
            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = `${driver.first_name} ${driver.last_name} (Car: ${driver.carNumber}, Status: ${driver.status})`;
                li.dataset.id = driver.id;
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => editDriver(driver));
                li.appendChild(editButton);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteDriver(driver.id));
                li.appendChild(deleteButton);
                driverList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error processing drivers:', error);
            alert('Failed to load drivers. Please try again later.');
        });
}

// Load available cars for selection
function loadAvailableCars() {
    fetch('/api/cars')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(cars => {
            carNumberSelect.innerHTML = ''; // Clear existing options
            cars.forEach(car => {
                if (car.driver_id === null) { // Only show cars without assigned drivers
                    const option = document.createElement('option');
                    option.value = car.number;
                    option.textContent = `Car ${car.number} - ${car.name}`;
                    carNumberSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Error loading cars:', error);
            alert('Failed to load cars. Please check the console for more details.');
        });
}

// Handle form submission for creating/updating a driver
driverForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const id = driverIdInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const carNumber = carNumberSelect.value;
    const status = statusInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/drivers/${id}` : '/api/drivers';
    const data = { firstName, lastName, carNumber, status };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        driverForm.reset();
        loadDrivers();       // Reload the list of drivers
        loadAvailableCars(); // Reload the list of available cars
    })
    .catch(error => {
        console.error('Error processing driver:', error);
        alert('Failed to save driver. Please try again.');
    });
});

// Populate the form with driver data for editing
function editDriver(driver) {
    driverIdInput.value = driver.id;
    firstNameInput.value = driver.first_name;
    lastNameInput.value = driver.last_name;
    carNumberSelect.value = driver.carNumber;
    statusInput.value = driver.status;
}

// Delete a driver
function deleteDriver(id) {
    fetch(`/api/drivers/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Failed to delete driver: ' + data.error);
            } else {
                loadDrivers();       // Reload the list of drivers
                loadAvailableCars(); // Reload the list of available cars
            }
        })
        .catch(error => {
            console.error('Error deleting driver:', error);
            alert('Failed to delete driver. Please try again.');
        });
}

// Handle race session form submission
raceSessionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const raceDate = raceDateInput.value;
    if (!raceDate) {
        alert('Race date is required');
        return;
    }

    const raceData = { race_date: raceDate };

    fetch('/api/races', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raceData)
    })
    .then(response => response.json())
    .then(() => {
        raceSessionForm.reset();
        loadRaceSessions();  // Reload the race sessions after adding a new one
    })
    .catch(error => {
        console.error('Error creating race session:', error);
        alert('Failed to create race session. Please try again later.');
    });
});

// Open the modal to select drivers
function openAddDriverModal(raceId) {
    const modal = document.getElementById("addDriverModal");
    modal.style.display = "block"; // Show the modal

    // Fetch drivers not yet assigned to this race
    fetch(`/api/drivers/not-in-race/${raceId}`)
        .then(response => response.json())
        .then(drivers => {
            console.log(drivers);  // Debug: log drivers to see if the response is correct
            const driverSelect = document.getElementById("modal-driver-selection");
            driverSelect.innerHTML = '';  // Clear previous options

            if (drivers.length === 0) {
                const option = document.createElement('option');
                option.textContent = "No drivers available to add";
                driverSelect.appendChild(option);
                return;
            }

            drivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.id;
                option.textContent = `${driver.first_name} ${driver.last_name} (Car: ${driver.carNumber})`;
                driverSelect.appendChild(option);
            });

            // Attach an event listener to add the selected driver to the race
            document.getElementById('addDriverToRace').onclick = function () {
                const selectedDrivers = Array.from(driverSelect.selectedOptions).map(opt => ({
                    driverId: opt.value,
                    carNumber: opt.textContent.match(/\(Car: (\d+)\)/)[1]
                }));
                addDriverToRace(raceId, selectedDrivers);
                modal.style.display = "none";  // Close the modal
            };
        })
        .catch(error => {
            console.error('Error fetching available drivers:', error);
            alert('Failed to load available drivers. Please try again later.');
        });
}


// Add drivers to the race session
function addDriverToRace(raceId, selectedDrivers) {
    const raceData = {
        driverCarAssignments: selectedDrivers
    };

    fetch(`/api/races/${raceId}/add-driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raceData)
    })
    .then(() => {
        loadRaceSessions();  // Reload the race sessions after adding the driver
    })
    .catch(error => {
        console.error('Error adding drivers to race:', error);
        alert('Failed to add driver. Please try again later.');
    });
}



// Attach event listener to the modal close button
document.querySelector(".modal .close").onclick = function() {
    document.getElementById("addDriverModal").style.display = "none";
};

// Handle the add driver button click to open the modal
function handleAddDriver(event) {
    const raceId = event.target.dataset.raceId;
    openAddDriverModal(raceId);
}

// Handle deleting a race
function handleDeleteRace(event) {
    const raceId = event.target.dataset.raceId;
    fetch(`/api/races/${raceId}`, { method: 'DELETE' })
        .then(() => loadRaceSessions())
        .catch(error => {
            console.error('Error deleting race:', error);
            alert('Failed to delete race. Please try again later.');
        });
}

// Existing loadRaceSessions function modified to avoid duplication
function loadRaceSessions() {
    fetch('/api/races')
        .then(response => response.json())
        .then(raceSessions => {
            if (!Array.isArray(raceSessions)) {
                throw new Error('Expected an array of race sessions');
            }

            raceSessionList.innerHTML = '';  // Clear the list

            const uniqueSessions = new Set();
            raceSessions.forEach(session => {
                if (!uniqueSessions.has(session.id)) {
                    uniqueSessions.add(session.id);

                    const li = document.createElement('li');
                    li.innerHTML = `
                        Race on ${session.race_date} - Status: ${session.status}
                        <ul id="drivers-in-race-${session.id}">
                            <!-- Drivers will be listed here -->
                        </ul>
                        <button class="add-driver" data-race-id="${session.id}">Add Driver</button>
                        <button class="delete-race" data-race-id="${session.id}">Delete</button>
                    `;
                    raceSessionList.appendChild(li);

                    // Only add drivers that are valid
                    raceSessions.filter(s => s.id === session.id && s.first_name && s.last_name).forEach(driver => {
                        const driverLi = document.createElement('li');
                        driverLi.textContent = `${driver.first_name} ${driver.last_name} (Car: ${driver.carNumber})`;
                        document.getElementById(`drivers-in-race-${session.id}`).appendChild(driverLi);
                    });
                }
            });

            // Attach event listeners to buttons
            document.querySelectorAll('.add-driver').forEach(button => {
                button.addEventListener('click', handleAddDriver);
            });
            document.querySelectorAll('.delete-race').forEach(button => {
                button.addEventListener('click', handleDeleteRace);
            });
        })
        .catch(error => {
            console.error('Error loading race sessions:', error);
            alert('Failed to load race sessions. Please try again later.');
        });
}


// Initial load of race sessions and other data
loadDrivers();
loadAvailableCars();
loadRaceSessions();

