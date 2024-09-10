// USING GLOBAL VARIABLES
const socket = io();
const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');

import { sendMessageFromValue, displayMessage } from './lap-line-tracker-functions.js';

// connects
socket.on('connect', () => {
    console.log('Connected to WebSocket server'); // reaches and works
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

// button click does start the lets-peak 
socket.on('lets-peak', (message) => {
    console.log("AFTER lets-peak")
    displayMessage(message)
}); 

socket.on('peak',(value) => {
 console.log(value);
 displayMessage(value)
})

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        const buttonValue = this.value;
        socket.emit('lets-peak', buttonValue) 
        sendMessageFromValue(buttonValue);
        displayMessage(buttonValue);
    });
});


