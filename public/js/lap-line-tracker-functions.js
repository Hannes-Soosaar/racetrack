// USING GLOBAL VARIABLES

const messageContainer = document.getElementById('peak');

export function sendMessageFromValue(value) {
    console.log("send message! " + value);
    // console.log("newValue: " + newValue);
    displayMessage(value);
    return addLapValue(value);
}

export function displayMessage(value) {
    messageContainer.innerHTML += `<p>${value}</p>`;
}

export function addLapValue(value) {
    console.log("you pressed the button: " + value);
    const newValue = Number(value)+  1;
    console.log("you pressed the button: " + newValue);
    return newValue
}

