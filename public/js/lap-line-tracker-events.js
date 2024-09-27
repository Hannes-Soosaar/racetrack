
const socket = io();

const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const messageContainer = document.getElementById('peak');


document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        const buttonValue = this.value;
        socket.emit(`set-lap`, buttonValue);
        console.log('buttonValue' + buttonValue);
    });
});


accessForm.addEventListener('submit', function (event) {
    console.log("made it to validation")
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'observer' });
});

// SOCKETS

socket.on('connect', () => {
    console.log('Connected to WebSocket server'); // reaches and works
});

socket.on('time-update', (timeElapsed) => {
    console.log(timeElapsed);
    displayMessage(timeElapsed);
});

socket.on('key-validation', function (response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

socket.on('lets-peak', (message) => {
    console.log("AFTER lets-peak")
    displayMessage(message)
});

socket.on('peak', (value) => {
    console.log(value);
    displayMessage(value)
})

// FUNCTIONS

function sendMessageFromValue(value) {
    console.log("send message! " + value);
    displayMessage(value);
}

function displayMessage(value) {
    messageContainer.innerHTML = `<p>${value}</p>`;
}