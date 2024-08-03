document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('game-settings-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        enterWaitingRoom();
    });

    typeText(document.getElementById('game-setup-text'));
});

function typeText(element) {
    const text = element.innerHTML;
    element.innerHTML = '';

    let index = 0;
    const interval = setInterval(() => {
        element.innerHTML = text.slice(0, ++index);
        if (index === text.length) {
            clearInterval(interval);
        }
    }, 50);
}

function enterWaitingRoom() {
    const playerName = document.getElementById('player-name').value.trim();

    if (!playerName) {
        alert('Please enter your name.');
        return;
    }

    localStorage.setItem('playerName', playerName);

    const gameSetupText = document.getElementById('game-setup-text');
    const form = document.getElementById('game-settings-form');
    gameSetupText.innerHTML = `<p>Nice to meet you ${playerName}, moving you to a safe place... for now. Please hold.</p>`;

    setTimeout(() => {
        gameSetupText.classList.add('hidden');
        form.classList.add('hidden');
        document.getElementById('waiting-room').classList.remove('hidden');
        startEllipsisAnimation();
    }, 3000);
}

function startEllipsisAnimation() {
    const ellipsis = document.getElementById('ellipsis');
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        ellipsis.innerHTML = '.'.repeat(dots);
    }, 500);
}
