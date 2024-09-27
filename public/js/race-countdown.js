const socket = io();

const timerContainer = document.getElementById('race-timer');
//Connection to Front end is established

console.log("Hello!");


socket.on('time-updated',(raceTimeElapse) => {
displayMessage("Message!");
});


// This works!
function displayMessage(value) {
    timerContainer.innerHTML = `<p>${value}</p>`;
}