document.addEventListener("DOMContentLoaded", function() {
    const sharedTargetDate = '2024-09-19T10:30:00';
    let targetDate = new Date(sharedTargetDate);
    let host = localStorage.getItem('hostName') || 'Claudio Winkerman';
    let traitorCount = parseInt(localStorage.getItem('traitorCount') || '3');
    let clickCount = 0;
    let settingsOpen = false;
    let passwordAttempts = 0;
    let offModeAttempts = 0; // Add this line

    const players = JSON.parse(localStorage.getItem('players') || '[]');
    let rolesAssigned = false;

    function getCurrentTime() {
        return new Date();
    }

    function updateGameDisplay() {
        let today = getCurrentTime();
        if (today < targetDate && !localStorage.getItem('gameStarted')) {
            document.getElementById('announcement').style.display = 'block';
            document.getElementById('settings-link').style.display = 'block';
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
            
            // Shrink the castle image
            const entryButton = document.getElementById('entry-button');
            entryButton.style.transition = 'width 0.5s ease';
            entryButton.style.width = '250px'; // Shrink to 250px, adjust as needed

            typeWriterEffect('announcement', function() {
                typeWriterEffect('settings-link', null, true);
            });
            document.getElementById('announcement').style.color = '#544502';
        } else {
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            document.getElementById('entry-prompt').style.display = 'block';
            document.getElementById('settings-link').style.display = 'none';
            
            // Reset castle size
            document.getElementById('entry-button').style.width = '300px';

            typeWriterEffect('entry-prompt');
            document.getElementById('entry-button').onclick = function() {
                window.location.href = 'game-setup.html';
            };
        }
        document.getElementById('entry-button').style.pointerEvents = 'auto';
    }

    // Call updateGameDisplay initially and set up an interval to check regularly
    updateGameDisplay();
    setInterval(updateGameDisplay, 60000); // Check every minute

    // Check if we're on the game setup page
    if (document.getElementById('game-setup-text')) {
        const gameSetupText = document.getElementById('game-setup-text');
        const textContent = `Hello there!

My name is Claudio Winkerman, and welcome to the entirely original concept of a game called The Traitors Game.

So I can get to know you, can you please type in your name in the box below? The host (that's me!) will need to be able to recognise the name you input, so whilst you can get creative, don't call yourself something silly like a Prisma Campaign ID. I'm just a game host - I don't even know what a 'Prisma' is!`;
        typeGameSetupText(gameSetupText, textContent, enterNameForm);
    } else if (document.querySelector('.waiting-room-container')) {
        startEllipsisAnimation();
    } else if (document.querySelector('.host-dashboard-container')) {
        updateHostDashboard();
    }
}
    
    function startGame() {
    assignRoles();
    localStorage.setItem('gameStarted', 'true');
    localStorage.setItem('players', JSON.stringify(players));
    // Additional game start logic can be added here
}
    
window.joinGame = function() {
    const playerName = document.getElementById('player-name').value.trim();
    if (playerName === '') {
        alert('Please enter your name');
        return;
    }
    if (players.some(player => player.name === playerName)) {
        alert('This name is already taken');
        return;
    }
    players.push({ name: playerName });
    localStorage.setItem('players', JSON.stringify(players));
    enterWaitingRoom();
};

    function assignRoles() {
        if (rolesAssigned) return;
        rolesAssigned = true;

        const totalPlayers = players.length;
        const roles = Array(totalPlayers).fill('Faithful');
        roles[0] = 'Host';
        for (let i = 1; i <= traitorCount; i++) {
            roles[i] = 'Traitor';
        }
        shuffle(roles);
        players.forEach((player, index) => {
            player.role = roles[index];
        });
    }

    function displayRole(playerName) {
        const player = players.find(p => p.name === playerName);
        if (player) {
            document.getElementById('role').innerText = player.role;
            document.getElementById('player-role').style.display = 'block';
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    document.getElementById('settings-link')?.addEventListener('click', function(event) {
        event.preventDefault();
        if (settingsOpen) {
            document.getElementById('settings-container').style.display = 'none';
            document.getElementById('password-container').style.display = 'none';
            document.getElementById('entry-button').style.width = '300px';
            settingsOpen = false;
        } else {
            document.getElementById('password-container').style.display = 'block';
            document.getElementById('password-container').style.transition = 'all 0.5s ease-in-out';
            document.getElementById('password-container').style.transform = 'translateY(0)';
            settingsOpen = true;
        }
    });

    document.getElementById('password-input')?.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkPassword();
        }
    });

    window.checkPassword = function() {
        const password = document.getElementById('password-input').value;
        if (password === 'harrywins') {
            document.getElementById('password-container').style.display = 'none';
            document.getElementById('settings-container').style.display = 'block';
            document.getElementById('host-name').value = host;
            document.getElementById('traitor-count').value = traitorCount;
            passwordAttempts = 0;

            // Add a button for starting the game early
        const startEarlyButton = document.createElement('button');
        startEarlyButton.textContent = 'Start Game Early';
        startEarlyButton.onclick = startGameEarly;
        document.getElementById('settings-container').appendChild(startEarlyButton);
        } else {
            passwordAttempts++;
            const passwordError = document.getElementById('password-error');
            passwordError.style.display = 'block';
            passwordError.classList.add('wiggle');
            setTimeout(() => passwordError.classList.remove('wiggle'), 500);
            
            const entryButton = document.getElementById('entry-button');
            let currentWidth = parseFloat(getComputedStyle(entryButton).width);
            entryButton.style.width = (currentWidth * 1.1) + "px";
            
            if (passwordAttempts >= 5) {
                goToOffMode();
            }
        }
    };
    
    window.saveSettings = function() {
        host = document.getElementById('host-name').value;
        traitorCount = parseInt(document.getElementById('traitor-count').value);

        localStorage.setItem('hostName', host);
        localStorage.setItem('traitorCount', traitorCount);

        alert('Settings saved. Please refresh the page to apply changes.');
    };

    window.handleCastleClick = function() {
    let today = getCurrentTime();
    if (today < targetDate) {
        offModeAttempts++; // Change this from clickCount to offModeAttempts
        const entryButton = document.getElementById('entry-button');
        const settingsLink = document.getElementById('settings-link');
        const announcement = document.getElementById('announcement');

        if (offModeAttempts < 5) { // Change this from clickCount to offModeAttempts
            let currentWidth = parseFloat(getComputedStyle(entryButton).width);
            entryButton.style.width = (currentWidth * 0.85) + "px";
        } else if (offModeAttempts === 5) { // Change this from clickCount to offModeAttempts
            goToOffMode();
        }
    } else {
        window.location.href = 'game-setup.html';
    }
};

    function goToOffMode() {
        const entryButton = document.getElementById('entry-button');
        const settingsLink = document.getElementById('settings-link');
        const announcement = document.getElementById('announcement');
        const smallText = document.getElementById('small-text');

        document.body.style.transition = 'background-color 2s';
        document.body.style.backgroundColor = "#202741";
        entryButton.style.width = "100vw";
        entryButton.style.height = "100vh";
        entryButton.style.position = "fixed";
        entryButton.style.top = "0";
        entryButton.style.left = "0";
        entryButton.style.transform = "none";
        entryButton.style.transition = "all 2s ease";
        entryButton.style.objectFit = "cover";
        entryButton.style.zIndex = "1001";

        announcement.style.transition = 'opacity 0.5s';
        announcement.style.opacity = '0';
        settingsLink.style.transition = 'opacity 0.5s';
        settingsLink.style.opacity = '0';
        settingsLink.style.position = 'fixed';

        smallText.style.zIndex = "1000";

        setTimeout(function() {
            document.getElementById('app').style.display = "none";
            document.getElementById('settings-container').style.display = 'none';
            document.getElementById('password-container').style.display = 'none';
            smallText.style.color = 'white';
            const formattedDate = targetDate.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(',', '');
            typeWriterEffect('off-mode-message', null, true, `Stop messing about, you! Come back on ${formattedDate}`);
        }, 2000);
    }

    function typeWriterEffect(elementId, callback, noIndicatorAfter = false, text = null) {
    const element = document.getElementById(elementId) || createMessageElement(elementId);
    const lines = text ? [text] : element.innerText.split('\n');
    element.innerHTML = '';
    let lineIndex = 0;
    let charIndex = 0;

    function typeWriter() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                element.innerHTML += lines[lineIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                if (lineIndex < lines.length - 1 || !noIndicatorAfter) {
                    element.innerHTML += '<span class="typing-indicator">|</span><br>';
                }
                lineIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 500);
            }
        } else {
            element.innerHTML = element.innerHTML.replace('<span class="typing-indicator">|</span>', '');
            if (callback) callback();
        }
    }

    typeWriter();
}

    function createMessageElement(id) {
        const message = document.createElement('p');
        message.id = id;
        message.style.color = "white";
        message.style.fontSize = "1.5em";
        message.style.position = "fixed";
        message.style.top = "50%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)";
        message.style.textAlign = "center";
        message.style.whiteSpace = "pre-wrap";
        message.style.zIndex = "1002";
        document.body.appendChild(message);
        return message;
    }

    function requestNotificationPermission() {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    alert('Notifications enabled!');
                } else {
                    alert('Notifications not enabled. You can enable them in your browser settings.');
                }
            });
        }
    }

    function scheduleNotifications() {
        if (Notification.permission === 'granted') {
            const voteTime = new Date();
            voteTime.setMinutes(voteTime.getMinutes() + 1);
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification('Time to vote!', {
                    body: 'It\'s time to cast your vote.',
                    tag: 'vote-notification',
                    timestamp: voteTime.getTime()
                });
            });
        }
    }
    
window.startGameEarly = function() {
     if (confirm("Are you sure you want to start the game early?")) {
        startGame();
        localStorage.setItem('gameStarted', 'true');
        alert("Game started early!");
        updateGameDisplay();
        updateHostDashboard();
    }
};
    
    function typeGameSetupText(element, text, callback) {
        const paragraphs = text.split('\n\n');
        element.innerHTML = '';

        let paragraphIndex = 0;
        let charIndex = 0;

        function typeChar() {
            if (paragraphIndex < paragraphs.length) {
                if (charIndex === 0) {
                    const p = document.createElement('p');
                    element.appendChild(p);
                }

                const currentParagraph = element.lastElementChild;
                currentParagraph.innerHTML += paragraphs[paragraphIndex][charIndex];
                charIndex++;

                if (charIndex < paragraphs[paragraphIndex].length) {
                    setTimeout(typeChar, 50);
                } else {
                    charIndex = 0;
                    paragraphIndex++;
                    if (paragraphIndex < paragraphs.length) {
                        setTimeout(typeChar, 500);
                    } else if (callback) {
                        callback();
                    }
                }
            }
        }

        typeChar();
    }

    function enterNameForm() {
        document.getElementById('game-settings-form').classList.remove('hidden');
    }

    window.enterWaitingRoom = function() {
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
            window.location.href = 'waiting-room.html';
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

function updateHostDashboard() {
    const playerList = document.getElementById('player-list');
    const startGameButton = document.getElementById('start-game-button');
    
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name + (player.role ? ` - ${player.role}` : '');
        playerList.appendChild(li);
    });

    startGameButton.disabled = players.length < 3;
}
    
    // New function for host's backdoor
    window.checkHostPassword = function() {
    const password = document.getElementById('host-password-input').value;
    if (password === 'harrywins') {
        window.location.href = 'host-dashboard.html';
    } else {
        alert('Incorrect password');
    }
};
});
