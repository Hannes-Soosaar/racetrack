
const socket = io();

const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const messageContainer = document.getElementById('peak');
const IdContainer = document.getElementById('raceId');
const carsContainer = document.getElementById('cars-container');
let raceID = null;
let message;


//Listeners
accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'observer' });
});

//SOCKETS
socket.on('connect', () => {
    console.log('Connected to WebSocket server lap-line-tracker'); // reaches and works
    if (raceID === null) {
        removeButtons();
        console.log("logic passed!")
        displayRaceSessionMessage("No race in progress");
        // socket.emit('get-raceId');
    } else {
        displayButtons();
        message = "Race with Id: " + raceID + " in progress";
        console.log(message);
        displayRaceSessionMessage(message);
    };
});

socket.on('time-update', (timeElapsed) => {
    displayMessage(timeElapsed);
});

socket.on('set-raceId', (raceId) => {
    raceID = raceId;
    if (raceID === null || raceID === undefined) {
        displayRaceSessionMessage("No race in progress");
    } else {
        const message = "Race with Id: " + raceID + " in progress";
        displayRaceSessionMessage(message);
        displayButtons();
    }
    socket.emit('raceId-set', raceID)
});

socket.on('stop-timer', () => {
    message = raceID + " finished"
    displayRaceSessionMessage(message);
    displayMessage("00:00");
    raceID = null;
    removeButtons();
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
    messageContainer.innerHTML = `${value}`;
}
function displayRaceSessionMessage(value) {
    IdContainer.innerHTML = `${value}`;
}

function displayButtons() {
    console.log("displaying buttons");
    carsContainer.innerHTML = `   
                <button class="tap-button" id = "slot_1" value = "1" > Car 1</button >
                <button class="tap-button" id="slot_2" value="2">Car 2</button>
                <button class="tap-button" id="slot_3" value="3">Car 3</button>
                <button class="tap-button" id="slot_4" value="4">Car 4</button>
                <button class="tap-button" id="slot_5" value="5">Car 5</button>
                <button class="tap-button" id="slot_6" value="6">Car 6</button>
                <button class="tap-button" id="slot_7" value="7">Car 7</button>
                <button class="tap-button" id="slot_8" value="8">Car 8</button>
    `;
    document.querySelectorAll('.button').forEach(button => {
        if (raceID !== null) {
            console.log("the race ID is ", raceID, "and we are adding all this functionality");
            button.addEventListener('click', function () {
                const buttonValue = parseInt(this.value);
                let raceIdCarNumber = [raceID, buttonValue];
                console.log("this is called twice at the backend!");
                socket.emit('set-car-lap', raceIdCarNumber); //! from here we also do the updateLeader-board.
            });
        } else {
            alert("no race in progress!");
        }
    });
}

function removeButtons() {
    console.log("removing buttons");
    carsContainer.innerHTML = ``;
}