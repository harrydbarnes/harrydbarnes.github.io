document.addEventListener("DOMContentLoaded", function() {
    const sharedTargetDate = '2024-09-19T10:30:00';
    let today = new Date();
    let targetDate = new Date(sharedTargetDate);
    let host = localStorage.getItem('hostName') || 'Claudio Winkerman';
    let traitorCount = parseInt(localStorage.getItem('traitorCount') || '3');
    let clickCount = 0;
    let settingsOpen = false;
    let passwordAttempts = 0;

    const players = [];
    let rolesAssigned = false;

    // Check if we're on the game setup page
    if (document.getElementById('game-setup-text')) {
        const gameSetupText = document.getElementById('game-setup-text');
        const textContent = `Hello there!

My name is Claudio Winkerman, and welcome to the entirely original concept of a game called The Traitors Game.

So I can get to know you, can you please type in your name in the box below? The host (that's me!) will need to be able to recognise the name you input, so whilst you can get creative, don't call yourself something silly like a Prisma Campaign ID. I'm just a game host - I don't even know what a 'Prisma' is!`;
        typeGameSetupText(gameSetupText, textContent, enterNameForm);
    } else {
        updateGameDisplay();
    }

     function updateGameDisplay() {
        if (today < targetDate) {
            document.getElementById('announcement').style.display = 'block';
            typeWriterEffect('announcement', function() {
                document.getElementById('settings-link').style.display = 'block';
                typeWriterEffect('settings-link', null, true);
            }, false);
            document.getElementById('announcement').style.color = '#544502';
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
            document.getElementById('entry-button').style.pointerEvents = 'auto';
        } else {
            startGame();
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'block';
            typeWriterEffect('entry-prompt');
            document.getElementById('entry-button').style.pointerEvents = 'auto';
            document.getElementById('entry-button').onclick = function() {
                window.location.href = 'game-setup.html';
            };
        }
    }

    function startGame() {
        assignRoles();
        players.forEach(player => displayRole(player.name));
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
        displayRole(playerName);
        scheduleNotifications();
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

  document.getElementById('settings-link').addEventListener('click', function(event) {
        event.preventDefault();
        if (settingsOpen) {
            closeSettings();
        } else if (passwordAttempts > 0) {
            openSettings();
        } else {
            togglePasswordContainer();
        }
    });

    document.getElementById('password-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            window.checkPassword();
        }
    });
    
   function openPasswordContainer() {
    const passwordContainer = document.getElementById('password-container');
    passwordContainer.style.display = 'block';
    setTimeout(() => {
        passwordContainer.classList.add('show');
    }, 10);
}

    function closeSettings() {
        const settingsContainer = document.getElementById('settings-container');
        settingsContainer.classList.remove('show');
        setTimeout(() => {
            settingsContainer.style.display = 'none';
        }, 1000);
        settingsOpen = false;
    }

   window.checkPassword = function() {
    const password = document.getElementById('password-input').value;
    if (password === 'harrywins') {
        const passwordContainer = document.getElementById('password-container');
        
        passwordContainer.classList.remove('show');
        setTimeout(() => {
            passwordContainer.style.display = 'none';
            openSettings();
        }, 1000);

        document.getElementById('host-name').value = host;
        document.getElementById('traitor-count').value = traitorCount;
        passwordAttempts++;
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
        if (today < targetDate) {
            clickCount++;
            const entryButton = document.getElementById('entry-button');
            const settingsLink = document.getElementById('settings-link');
            const announcement = document.getElementById('announcement');

            if (clickCount < 5) {
                let currentWidth = parseFloat(getComputedStyle(entryButton).width);
                entryButton.style.width = (currentWidth * 0.85) + "px";
            } else if (clickCount === 5) {
                goToOffMode();
            }
        } else {
            window.location.href = 'game-setup.html';
        }
    };

function openSettings() {
    const settingsContainer = document.getElementById('settings-container');
    settingsContainer.style.display = 'block';
    setTimeout(() => {
        settingsContainer.classList.add('show');
    }, 10);
    settingsOpen = true;
}

      function goToOffMode() {
    const entryButton = document.getElementById('entry-button');
    const settingsLink = document.getElementById('settings-link');
    const announcement = document.getElementById('announcement');
    const smallText = document.getElementById('small-text');
    const passwordContainer = document.getElementById('password-container');
    const settingsContainer = document.getElementById('settings-container');

        document.body.style.transition = 'background-color 2s';
        document.body.style.backgroundColor = "#202741";
        entryButton.classList.add('fullscreen');
        entryButton.style.zIndex = "1001";
        passwordContainer.classList.remove('show');
        settingsContainer.classList.remove('show');

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
            passwordContainer.style.display = 'none';
            settingsContainer.style.display = 'none';
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

    function togglePasswordContainer() {
        const passwordContainer = document.getElementById('password-container');
        if (passwordContainer.style.display === 'none' || passwordContainer.style.display === '') {
            passwordContainer.style.display = 'block';
            setTimeout(() => {
                passwordContainer.classList.add('show');
            }, 10);
        } else {
            passwordContainer.classList.remove('show');
            setTimeout(() => {
                passwordContainer.style.display = 'none';
            }, 500);
        }
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
                element.innerHTML = lines[lineIndex].substring(0, charIndex + 1) + '<span class="typing-indicator">|</span>';
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                if (lineIndex < lines.length - 1 || !noIndicatorAfter) {
                    element.innerHTML = lines[lineIndex] + '<span class="typing-indicator">|</span><br>';
                } else {
                    element.innerHTML = lines[lineIndex] + (noIndicatorAfter ? '' : '<span class="typing-indicator">|</span>');
                }
                lineIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 500);
            }
        } else {
            if (!noIndicatorAfter) {
                element.innerHTML = element.innerHTML.replace('<span class="typing-indicator">|</span>', '');
            }
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
            today = new Date(targetDate.getTime() + 1000); // Set current time to just after target date
            updateGameDisplay();
            document.getElementById('settings-container').style.display = 'none';
            startGame();
            // Hide waiting room if it's visible
            const waitingRoom = document.getElementById('waiting-room');
            if (waitingRoom) {
                waitingRoom.classList.add('hidden');
            }
            // Show game content
            const gameContent = document.getElementById('game-content');
            if (gameContent) {
                gameContent.classList.remove('hidden');
            }
            alert("Game started early!");
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
            document.getElementById('game-setup').style.display = 'none'; // Hide the "Game Setup" text
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
