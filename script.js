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
                typeWriterEffect('settings-link');
            });
            document.getElementById('announcement').style.color = '#544502';
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'block';
            document.getElementById('entry-button').style.pointerEvents = 'auto';
        } else {
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
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
            settingsOpen = false;
        } else {
            document.getElementById('password-container').style.display = 'block';
            settingsOpen = true;
        }
    });

    window.checkPassword = function() {
        const password = document.getElementById('password-input').value;
        if (password === 'harrywins') {
            document.getElementById('password-container').style.display = 'none';
            document.getElementById('settings-container').style.display = 'block';
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

            if (clickCount < 5) {
                let currentWidth = parseFloat(entryButton.style.width) || 300;
                entryButton.style.width = (currentWidth * 0.85) + "px";
            } else if (clickCount === 5) {
                entryButton.style.width = "100%";
                entryButton.style.height = "100%";
                entryButton.style.position = "absolute";
                entryButton.style.top = "0";
                entryButton.style.left = "0";
                entryButton.style.transition = "all 2s ease";
                setTimeout(function() {
                    document.body.style.backgroundColor = "#202741";
                    document.getElementById('app').style.display = "none";
                    document.getElementById('settings-container').style.display = 'none';
                    document.getElementById('password-container').style.display = 'none';
                    const message = document.createElement('p');
                    message.innerText = "Stop messing about, you... please refresh the page on the 19th September 2024 at 10:30am";
                    message.style.color = "white";
                    message.style.fontSize = "1.5em";
                    message.style.position = "absolute";
                    message.style.top = "50%";
                    message.style.left = "50%";
                    message.style.transform = "translate(-50%, -50%)";
                    message.style.textAlign = "center";
                    message.style.whiteSpace = "pre-wrap";
                    document.body.appendChild(message);
                }, 2000);
            }
        } else {
            window.location.href = 'game-setup.html';
        }
    };

    function typeWriterEffect(elementId, callback) {
        const element = document.getElementById(elementId);
        const text = element.innerText;
        element.innerHTML = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    if (callback) {
                        callback();
                    }
                }, 50); // Delay removing the cursor
            }
        }
        typeWriter();
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
