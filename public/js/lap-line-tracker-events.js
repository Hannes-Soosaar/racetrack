
const socket = io();

const accessForm = document.getElementById('access-form');
const accessKeyInput = document.getElementById('access-key');
const contentDiv = document.getElementById('content');
const IdContainer = document.getElementById('raceId');
const carsContainer = document.getElementById('cars-container');
const errorMessage = document.getElementById('error-message');
const fullscreenBtn = document.getElementById('fullscreenBtn');
let raceID = null;
let message;

accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const accessKey = accessKeyInput.value;
    socket.emit('validate-key', { key: accessKey, role: 'observer' });
});

fullscreenBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen();
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.style.display = 'none';
    } else {
        fullscreenBtn.style.display = '';
    }
});

socket.on('connect', () => {
    socket.emit('get-session');
    console.log('Connected to WebSocket server lap-line-tracker');
    if (raceID === null) {
        removeButtons();
        displayRaceSessionMessage("No race");
    } else {
        displayButtons();
        displayRaceSessionMessage(message);
    };
});

socket.on('set-raceId', (raceId) => {
    raceID = raceId;
    if (raceID === null || raceID === undefined) {
        displayRaceSessionMessage("No race");
        removeButtons();
    } else {
        const message = "Race: " + raceID + " in progress";
        displayRaceSessionMessage(message);
        displayButtons();
    }
    socket.emit('raceId-set', raceID) //? This is not used.
});

socket.on('key-validation', function (response) {
    console.log("response");
    if (response.success) {
        accessForm.style.display = 'none';
        contentDiv.style.display = 'block';
    } else {
        errorMessage.textContent = 'Invalid access key. Please try again.';
    }
});

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
    document.querySelectorAll('.tap-button').forEach(button => {
        if (raceID !== null) {
            button.addEventListener('click', function () {
                const buttonValue = parseInt(this.value);
                let raceIdCarNumber = [raceID, buttonValue];
                socket.emit('set-car-lap', raceIdCarNumber);
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