const socket = io()
const fullscreenBtn = document.getElementById('fullscreenBtn');

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
    console.log('Connected to WebSocket server');
    socket.emit('public-view', 'race-flags')
    socket.emit('get-flag-status')
});

socket.on('race-flags-update', (data) => {
    switch (data) {
        case 1:
            document.body.classList.remove('chequered')
            color = 'green'
            document.body.style.backgroundColor = color
            break
        case 2:
            document.body.classList.remove('chequered')
            color = 'red'
            document.body.style.backgroundColor = color
            break
        case 5:
            document.body.classList.remove('chequered')
            color = 'yellow'
            document.body.style.backgroundColor = color
            break
        case 3:
            document.body.style.backgroundColor = ''
            document.body.classList.add('chequered')
            break
        default:
            document.body.style.backgroundColor = ''; // Reset background color
            document.body.style.backgroundImage = ''; // Reset background image
            break
    }
})

socket.on('reload', () => {
    location.reload()
})