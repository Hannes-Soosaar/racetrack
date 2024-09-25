const socket = io()
const nextRaceDiv = document.getElementById('nextRaceStatus')

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    socket.emit('public-view', 'next-race')
    socket.emit('get-next-race-status')
});

socket.on('update-next-race', (nextRaceData) => {
    console.log(nextRaceData)
    nextRaceDiv.innerHTML = ''
    const paragraph = document.createElement('p')
    if (nextRaceData === null) {
        paragraph.textContent = 'Currently there are no scheduled races!'
        nextRaceDiv.appendChild(paragraph)
    } else {
        paragraph.textContent = 'Next race info:'
        nextRaceDiv.appendChild(paragraph)
        nextRaceData.forEach(driver => {
            const textLine = document.createElement('p');
            textLine.textContent = `Driver: ${driver.driver_name}, Car Number: ${driver.car_number}`;
            nextRaceDiv.appendChild(textLine);
        });
    }
})

socket.on('trigger-get-next-race-status', () => {
    socket.emit('get-next-race-status')
})

socket.on('trigger-next-race-message', () => {
    const driverMessage = document.createElement('p')
    driverMessage.textContent = 'Drivers, please proceed to the paddock'
    nextRaceDiv.appendChild(driverMessage)
})