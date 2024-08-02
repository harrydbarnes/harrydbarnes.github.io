document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    let targetDate = new Date(sharedTargetDate);
    let host = localStorage.getItem('hostName') || 'Claudio Winkerman';
    let traitorCount = parseInt(localStorage.getItem('traitorCount') || '3');
    let clickCount = 0;

    function updateGameDisplay() {
        if (today < targetDate) {
            document.getElementById('announcement').style.display = 'block';
            document.getElementById('announcement').style.color = '#544502'; // Update announcement color
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
            document.getElementById('entry-button').style.pointerEvents = 'auto'; // Make clickable before target date
        } else {
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
            document.getElementById('entry-button').style.pointerEvents = 'auto';
            document.getElementById('entry-button').onclick = function() {
                window.location.href = 'game-setup.html'; // Redirect to game setup page
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
        document.getElementById('password-container').style.display = 'block';
    });

    window.checkPassword = function() {
        const password = document.getElementById('password-input').value;
        if (password === 'harrywins') {
            document.getElementById('password-container').style.display = 'none';
            document.getElementById('settings-container').style.display = 'block';
        } else {
            alert('You're very forgetful today Claudio...');
        }
    };

    window.saveSettings = function() {
        host = document.getElementById('host-name').value;
        traitorCount = parseInt(document.getElementById('traitor-count').value);

        // Save settings to localStorage
        localStorage.setItem('hostName', host);
        localStorage.setItem('traitorCount', traitorCount);

        alert('Settings saved');
    };

    window.handleCastleClick = function() {
        if (today < targetDate) {
            clickCount++;
            const entryButton = document.getElementById('entry-button');

            if (clickCount < 10) {
                let currentWidth = parseFloat(entryButton.style.width) || 300; // Default width if not set
                entryButton.style.width = (currentWidth * 0.9) + "px";
            } else if (clickCount === 10) {
                entryButton.style.width = "100%";
                entryButton.style.height = "100%";
                entryButton.style.position = "absolute";
                entryButton.style.top = "0";
                entryButton.style.left = "0";
            }
        } else if (new Date() >= targetDate) {
            showGame();
        }
    };

    window.showGame = function() {
        if (new Date() >= targetDate) {
            document.getElementById('game-container').style.display = 'block';
            document.getElementById('entry-prompt').style.display = 'none';
            document.getElementById('entry-button').style.display = 'none';
        }
    };

    window.requestNotificationPermission = function() {
        Notification.requestPermission().then(function(result) {
            if (result === 'granted') {
                alert('Notifications enabled!');
            }
        });
    };

    function scheduleNotifications() {
        // Example: Notification for voting and checking results
        const votingNotification = new Notification("Time to Vote!", {
            body: "It's time to cast your vote in The Traitors Game!",
            icon: "favicon.ico"
        });

        const resultNotification = new Notification("Check Results", {
            body: "The results are in! Check who the traitors are.",
            icon: "favicon.ico"
        });

        // Schedule notifications (For demo purposes, they appear immediately)
        setTimeout(() => votingNotification, 10000); // 10 seconds delay
        setTimeout(() => resultNotification, 20000); // 20 seconds delay
    }
});
