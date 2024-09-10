// USING GLOBAL VARIABLES
const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');

// This creates a new connection to the io stream. 
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    displayMessage("Connected to WebSocket server") // reaches and works
});

import { sendMessageFromValue, displayMessage } from './lap-line-tracker-functions.js';

socket.on('lets-peak',(message) => {
    console.log("AFTER lets-peak")
    displayMessage(message)
} ); // test to see if we can get some data from the backend, does not work!

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        const buttonValue = this.value;
        socket.emit('lets-peak', buttonValue) // does not work.
        console.log("AFTER lets-peak")
        const newValue = sendMessageFromValue(buttonValue);
        displayMessage(newValue);
    });
});

accessForm.addEventListener('submit', function (event) {
    console.log("made it to validation")
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'observer' });
});

socket.on('key-validation', function (response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

