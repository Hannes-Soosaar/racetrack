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
        loadDrivers();
        loadAvailableCars();
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
driverForm.addEventListener('submit', function(event) {
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

