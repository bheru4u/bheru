document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const auctionContainer = document.getElementById('auction-container');
    const adminPanel = document.getElementById('admin-panel');
    const biddingContainer = document.getElementById('bidding-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    let socket;

    // Form toggling
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Registration
    document.getElementById('register-button').addEventListener('click', async () => {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const teamId = document.getElementById('register-teamId').value;

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, teamId })
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
    });

    // Login
    document.getElementById('login-button').addEventListener('click', async () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const { token, isAdmin } = await response.json();
            localStorage.setItem('token', token);
            localStorage.setItem('isAdmin', isAdmin);
            authContainer.style.display = 'none';
            auctionContainer.style.display = 'block';
            initializeAuction(token, isAdmin);
        } else {
            const data = await response.json();
            alert(data.message);
        }
    });

    // Logout
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.clear();
        if (socket) socket.disconnect();
        auctionContainer.style.display = 'none';
        authContainer.style.display = 'block';
        adminPanel.style.display = 'none';
        biddingContainer.style.display = 'block';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        authContainer.style.display = 'none';
        auctionContainer.style.display = 'block';
        initializeAuction(token, isAdmin);
    }

    function initializeAuction(token, isAdmin) {
        // Role-based UI
        if (isAdmin) {
            adminPanel.style.display = 'block';
            biddingContainer.style.display = 'none';
        } else {
            adminPanel.style.display = 'none';
            biddingContainer.style.display = 'block';
        }

        fetchPlayers();
        fetchTeams();

        socket = io({ auth: { token } });

        socket.on('connect_error', (err) => {
            alert(err.message);
            document.getElementById('logout-button').click();
        });

        socket.on('connect', () => console.log('Connected to WebSocket server'));
        socket.on('currentPlayer', updateCurrentPlayer);
        socket.on('auctionState', updateAuctionState);
        socket.on('playerSold', ({ player, team }) => alert(`${player.name} sold to ${team.name} for $${player.sellingPrice.toLocaleString()}`));
        socket.on('playerUnsold', (player) => alert(`${player.name} went unsold.`));
        socket.on('teams', renderTeams);
        socket.on('players', renderPlayers);
        socket.on('auctionEnd', (data) => {
            alert(data.message);
            document.getElementById('bid-button').disabled = true;
        });
        socket.on('error', (data) => alert(`Error: ${data.message}`));

        // Event listeners for UI elements
        document.getElementById('bid-button').addEventListener('click', () => socket.emit('bid'));
        document.getElementById('start-auction-button').addEventListener('click', () => socket.emit('startAuction'));
        document.getElementById('upload-players-button').addEventListener('click', uploadPlayers);
    }

    async function uploadPlayers() {
        const fileInput = document.getElementById('player-file-input');
        const file = fileInput.files[0];
        if (!file) {
            return alert('Please select a file to upload.');
        }

        const formData = new FormData();
        formData.append('playerFile', file);

        const response = await fetch('/api/admin/players/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            fileInput.value = ''; // Clear the file input
        }
    }
});

function fetchPlayers() {
    fetch('/api/players')
        .then(response => response.json())
        .then(renderPlayers);
}

function fetchTeams() {
    fetch('/api/teams')
        .then(response => response.json())
        .then(renderTeams);
}

function renderPlayers(players) {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = '';
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        let price = player.status === 'sold' ? `Sold for: $${player.sellingPrice.toLocaleString()}` : `Base Price: $${player.basePrice.toLocaleString()}`;
        playerCard.innerHTML = `
            <h3>${player.name}</h3>
            <p>Role: ${player.role}</p>
            <p>${price}</p>
            <p>Status: ${player.status}</p>
            <p>Availability: ${player.availability}</p>
        `;
        playersContainer.appendChild(playerCard);
    });
}

function renderTeams(teams) {
    const teamsContainer = document.getElementById('teams-container');
    teamsContainer.innerHTML = '';
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <h3>${team.name}</h3>
            <p>Budget: $${team.budget.toLocaleString()}</p>
            <p>Players: ${team.players.length}</p>
        `;
        teamsContainer.appendChild(teamCard);
    });
}

function updateCurrentPlayer(player) {
    const currentPlayerContainer = document.getElementById('current-player');
    if (player) {
        currentPlayerContainer.innerHTML = `
            <h3>${player.name}</h3>
            <p>Role: ${player.role}</p>
            <p>Base Price: $${player.basePrice.toLocaleString()}</p>
        `;
    } else {
        currentPlayerContainer.innerHTML = `<p>Waiting for next player...</p>`;
    }
}

function updateAuctionState(state) {
    const bidButton = document.getElementById('bid-button');
    document.getElementById('timer').innerHTML = `Time Left: <strong>${state.timer}</strong>s`;
    document.getElementById('current-bid').innerHTML = `Current Bid: <strong>$${state.currentBid.toLocaleString()}</strong>`;
    document.getElementById('highest-bidder').innerHTML = `Highest Bidder: <strong>${state.highestBidder || '-'}</strong>`;

    if (state.isAuctionRunning && state.timer > 0) {
        bidButton.disabled = false;
    } else {
        bidButton.disabled = true;
    }
}
