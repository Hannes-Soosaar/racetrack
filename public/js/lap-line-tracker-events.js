
const socket = io();

const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const messageContainer = document.getElementById('peak');
const IdContainer = document.getElementById('raceId');
let raceID;


document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        const buttonValue = this.value;
        socket.emit('set-lap', buttonValue);
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
    console.log('Connected to WebSocket server lap-line-tracker'); // reaches and works
});

socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
});


//TODO: might want to redo this
socket.on('set-raceId', (raceId) =>{
    raceID = raceId;
    socket.emit('raceId-set',raceID)
    displayRaceId(raceID);
});

socket.on('stop-timer',()=> {
raceID = null;
});

socket.on('key-validation', function (response) {
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

// FUNCTIONS

function sendMessageFromValue(value) {
    console.log("send message! " + value);
    displayMessage(value);
}

function displayMessage(value) {
    messageContainer.innerHTML = `<p>${value}</p>`;
}
function displayRaceId(value) {
    IdContainer.innerHTML = `<p>${value}</p>`;
}