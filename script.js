document.addEventListener("DOMContentLoaded", function() {
    const sharedTargetDate = '2024-09-19T10:30:00';
    let today = new Date();
    let targetDate = new Date(sharedTargetDate);
    let host = localStorage.getItem('hostName') || 'Claudio Winkerman';
    let traitorCount = parseInt(localStorage.getItem('traitorCount') || '3');
    let clickCount = 0;
    let settingsOpen = false;

    function updateGameDisplay() {
        if (today < targetDate) {
            document.getElementById('announcement').style.display = 'block';
            typeWriterEffect('announcement', function() {
                document.getElementById('settings-link').style.display = 'block';
                typeWriterEffect('settings-link', null, true);
            });
            document.getElementById('announcement').style.color = '#544502';
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
            document.getElementById('entry-button').style.pointerEvents = 'auto';
        } else {
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'block';
            typeWriterEffect('entry-prompt');
            document.getElementById('entry-button').style.pointerEvents = 'auto';
            document.getElementById('entry-button').onclick = function() {
                window.location.href = 'game-setup.html';
            };
        }
    }

    updateGameDisplay();

    const players = [];
    let rolesAssigned = false;

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
        assignRoles();
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
            document.getElementById('settings-container').style.display = 'none';
            document.getElementById('password-container').style.display = 'none';
            document.getElementById('entry-button').style.width = '300px';
            settingsOpen = false;
        } else {
            document.getElementById('password-container').style.display = 'block';
            settingsOpen = true;
        }
    });

    document.getElementById('password-input').addEventListener('keypress', function(event) {
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
        } else {
            document.getElementById('password-error').style.display = 'block';
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
                document.body.style.transition = 'background-color 2s';
                document.body.style.backgroundColor = "#202741";
                entryButton.style.width = "100vmin";
                entryButton.style.height = "100vmin";
                entryButton.style.position = "fixed";
                entryButton.style.top = "50%";
                entryButton.style.left = "50%";
                entryButton.style.transform = "translate(-50%, -50%)";
                entryButton.style.transition = "all 2s ease";
                entryButton.style.objectFit = "contain";
                entryButton.style.zIndex = "1001";

                announcement.style.transition = 'opacity 0.5s';
                announcement.style.opacity = '0';
                settingsLink.style.transition = 'opacity 0.5s';
                settingsLink.style.opacity = '0';

                document.querySelector('.small-text').style.zIndex = "999";

                setTimeout(function() {
                    document.getElementById('app').style.display = "none";
                    document.getElementById('settings-container').style.display = 'none';
                    document.getElementById('password-container').style.display = 'none';
                    document.querySelector('.small-text').style.color = 'white';
                    typeWriterEffect('off-mode-message', null, true);
                }, 2000);
            }
        } else {
            window.location.href = 'game-setup.html';
        }
    };

    function typeWriterEffect(elementId, callback, noIndicatorAfter = false) {
        const element = document.getElementById(elementId) || createMessageElement(elementId);
        const lines = element.innerText.split('\n');
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
            alert("Game started early!");
        }
    };
});
