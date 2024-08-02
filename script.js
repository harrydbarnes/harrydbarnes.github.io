document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    let targetDate = new Date(sharedTargetDate);
    let host = localStorage.getItem('hostName') || 'Claudio Winkerman';
    let traitorCount = parseInt(localStorage.getItem('traitorCount') || '3');

    function updateGameDisplay() {
        if (today < targetDate) {
            document.getElementById('announcement').style.display = 'block';
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'none';
            document.getElementById('entry-button').style.pointerEvents = 'none';
        } else {
            document.getElementById('announcement').style.display = 'none';
            document.getElementById('entry-prompt').style.display = 'block';
            document.getElementById('entry-button').style.pointerEvents = 'auto';
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
            alert('Incorrect password');
        }
    };

    window.saveSettings = function() {
        host = document.getElementById('host-name').value;
        traitorCount = parseInt(document.getElementById('traitor-count').value);
        targetDate = new Date(document.getElementById('target-date').value);

        // Update sharedTargetDate (in a real server-side implementation, this should be stored server-side)
        sharedTargetDate = targetDate;

        updateGameDisplay();
        alert('Settings saved');
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
