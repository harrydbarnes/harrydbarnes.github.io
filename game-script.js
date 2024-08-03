document.addEventListener("DOMContentLoaded", function() {
    const gameSetupText = document.getElementById('game-setup-text');
    const textContent = `
        Hello there!

        My name is Claudio Winkerman, and welcome to the entirely original concept of a game called The Traitors Game.

        So I can get to know you, can you please type in your name in the box below? The host (that's me!) will need to be able to recognise the name you input, so whilst you can get creative, don't call yourself something silly like a Prisma Campaign ID. I'm just a game host - I don't even know what a 'Prisma' is!
    `;
    typeText(gameSetupText, textContent, enterNameForm);
});

function typeText(element, text, callback) {
    const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line !== '');
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
        } else if (callback) {
            callback();
        }
    }
    typeLine();
}

function enterNameForm() {
    document.getElementById('game-settings-form').classList.remove('hidden');
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
        gameSetupText.innerHTML = '';
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
