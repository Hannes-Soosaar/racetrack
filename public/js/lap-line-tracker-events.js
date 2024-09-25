// VARIABLES
const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const messageContainer = document.getElementById('peak');

// DOM FUNCTIONALITY
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        const buttonValue = this.value;

        socket.emit(`set-lap`, buttonValue);

        console.log('buttonValue' + buttonValue);
        // TEMP logic for quick testing
        // if (buttonValue === "1") {
        //     console.log("start-timer");
        //     socket.emit('start-timer', "lap-line-tracker")
        // } else if (buttonValue === "2") {
        //     console.log("pause-timer");
        //     socket.emit('pause-timer', "lap-line-tracker")
        // } else if (buttonValue === "3") {
        //     console.log("resume-timer");
        //     socket.emit('resume-timer', "lap-line-tracker")
        // } else if (buttonValue === "4") {
        //     console.log("stop-timer");
        //     socket.emit('stop-timer', "lap-line-tracker")
        // } else if (buttonValue === "5") {
        //     console.log("update the time");
        //     socket.emit('update-time', "lap-line-tracker")
        // }
        // else {
        //     socket.emit('lets-peak', buttonValue)
        //     sendMessageFromValue(buttonValue);
        //     displayMessage(buttonValue);
        // }
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