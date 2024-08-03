document.addEventListener("DOMContentLoaded", function() {
    typeText(document.getElementById('game-setup-text'));
});

function typeText(element) {
    const lines = element.innerHTML.split('\n').map(line => line.trim()).filter(line => line !== '');
    element.innerHTML = '';

    let index = 0;
    function typeLine() {
        if (index < lines.length) {
            const lineElement = document.createElement('p');
            element.appendChild(lineElement);
            let charIndex = 0;
            const interval = setInterval(() => {
                lineElement.innerHTML += lines[index][charIndex];
                charIndex++;
                if (charIndex === lines[index].length) {
                    clearInterval(interval);
                    index++;
                    typeLine();
                }
            }, 50);
        }
    }
    typeLine();
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
