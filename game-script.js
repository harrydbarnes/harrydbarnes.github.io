document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('game-settings-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        enterWaitingRoom();
    });
});

function enterWaitingRoom() {
    const playerName = document.getElementById('player-name').value.trim();

    if (!playerName) {
        alert('Please enter your name.');
        return;
    }

    localStorage.setItem('playerName', playerName);

    const introText = document.getElementById('intro-text');
    const form = document.getElementById('game-settings-form');
    const waitingRoom = document.getElementById('waiting-room');

    introText.classList.add('hidden');
    form.classList.add('hidden');
    waitingRoom.classList.remove('hidden');
}
