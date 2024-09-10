// Handle assigning a car and driver to a session
document.getElementById('assign-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const sessionId = document.getElementById('session-id').value;
    const carNumber = document.getElementById('car-number').value;
    const driverId = document.getElementById('driver-id').value;

    fetch('/api/races/assign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: sessionId,
            carNumber: carNumber,
            driverId: driverId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Ensure you're correctly parsing the JSON
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Handle viewing session assignments
document.getElementById('view-assignments-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const sessionId = document.getElementById('view-session-id').value;

    fetch(`/api/races/${sessionId}/assignments`)
    .then(response => response.json())
    .then(data => {
        const assignmentsDiv = document.getElementById('assignments');
        assignmentsDiv.innerHTML = '';

        if (data.message) {
            assignmentsDiv.innerHTML = `<p>${data.message}</p>`;
        } else {
            let cars = Array.from(data.cars).join(', ');
            let drivers = Array.from(data.drivers).join(', ');

            assignmentsDiv.innerHTML = `
                <h3>Race Session ${sessionId} Assignments:</h3>
                <p><strong>Cars:</strong> ${cars}</p>
                <p><strong>Drivers:</strong> ${drivers}</p>
            `;
        }
    })
    .catch(error => console.error('Error:', error));
});

    

// Handle viewing session assignments
document.getElementById('view-assignments-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const sessionId = document.getElementById('view-session-id').value;

    fetch(`/api/races/${sessionId}/assignments`)
    .then(response => response.json())
    .then(data => {
        const assignmentsDiv = document.getElementById('assignments');
        assignmentsDiv.innerHTML = '';

        if (data.message) {
            assignmentsDiv.innerHTML = `<p>${data.message}</p>`;
        } else {
            let cars = Array.from(data.cars).join(', ');
            let drivers = Array.from(data.drivers).join(', ');

            assignmentsDiv.innerHTML = `
                <h3>Race Session ${sessionId} Assignments:</h3>
                <p><strong>Cars:</strong> ${cars}</p>
                <p><strong>Drivers:</strong> ${drivers}</p>
            `;
        }
    })
    .catch(error => console.error('Error:', error));
});
