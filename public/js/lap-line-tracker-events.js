
const socket = io();

const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const messageContainer = document.getElementById('peak');
const IdContainer = document.getElementById('raceId');
let raceID = null;


document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        const buttonValue = parseInt(this.value);
        let raceIdCarNumber = [raceID, buttonValue];
        socket.emit('set-lap', raceIdCarNumber);
    });
});

//OK
accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'observer' });
});

// SOCKETS

socket.on('connect', () => {
    console.log('Connected to WebSocket server lap-line-tracker'); // reaches and works
    if (raceID === null) {
        console.log("logic passed!")
        socket.emit('get-raceId');
    };
});

socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
});


//TODO: might want to redo this
socket.on('set-raceId', (raceId) => {
    raceID = raceId;
    socket.emit('raceId-set', raceID)
    displayRaceId(raceID);
});


// When the race finishes it sends out null
socket.on('stop-timer', () => {
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