const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const errorMessage = document.getElementById('error-message');
const driverForm = document.getElementById('driver-form');
const driverIdInput = document.getElementById('driver-id');
const driverNameInput = document.getElementById('driver-name');
const carNumberInput = document.getElementById('car-number');
const driverList = document.getElementById('driver-list'); //move to db

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
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// Load drivers from the server
function loadDrivers() {
        console.log("Im doing the driver update using an API call!");
    fetch('/api/drivers')
        .then(response => response.json())
        .then(drivers => {
            driverList.innerHTML = '';
            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = `${driver.name} (Car Number: ${driver.carNumber})`;
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
        });
}

// Handle form submission for creating/updating a driver
driverForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const id = driverIdInput.value;
    const name = driverNameInput.value;
    const carNumber = carNumberInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/drivers/${id}` : '/api/drivers';
    const data = { name, carNumber };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        driverForm.reset();
        loadDrivers();
    });
});

// Populate the form with driver data for editing
function editDriver(driver) {
    driverIdInput.value = driver.id;
    driverNameInput.value = driver.name;
    carNumberInput.value = driver.carNumber;
}

// Delete a driver
function deleteDriver(id) {
    fetch(`/api/drivers/${id}`, { method: 'DELETE' })
        .then(() => loadDrivers());
}
