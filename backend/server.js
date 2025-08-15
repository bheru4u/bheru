const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csv = require('csv-parser');
const stream = require('stream');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;
const SECRET_KEY = 'your_super_secret_key';

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// In-memory data stores
let users = [];
let players = [];
let teams = [
    { id: 1, name: 'Team A', budget: 1000000, players: [], userId: null },
    { id: 2, name: 'Team B', budget: 1000000, players: [], userId: null },
];
let auctionState = { /* ... */ };

app.use(express.static('../frontend'));
app.use(express.json());

// Auth Middleware for HTTP routes
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = users.find(u => u.id === decoded.userId);
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password, teamId } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // First user to register is an admin
    const isAdmin = users.length === 0;
    const newUser = { id: users.length + 1, username, password: hashedPassword, teamId: teamId ? parseInt(teamId) : null, isAdmin };
    users.push(newUser);

    if (teamId) {
        const team = teams.find(t => t.id === parseInt(teamId));
        if (team) team.userId = newUser.id;
    }

    console.log('User registered:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, teamId: user.teamId, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, teamId: user.teamId, isAdmin: user.isAdmin });
});

// Admin route for bulk player upload
app.post('/api/admin/players/upload', authMiddleware, upload.single('playerFile'), (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const newPlayers = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
        .pipe(csv())
        .on('data', (data) => {
            const newPlayer = {
                id: players.length + newPlayers.length + 1,
                name: data.name,
                role: data.role,
                basePrice: parseInt(data.basePrice, 10),
                status: 'unsold',
                availability: data.availability || 'available'
            };
            newPlayers.push(newPlayer);
        })
        .on('end', () => {
            players.push(...newPlayers);
            io.emit('players', players); // Broadcast updated player list
            res.status(201).json({ message: `${newPlayers.length} players uploaded successfully.` });
            console.log('Players uploaded:', newPlayers);
        })
        .on('error', (error) => {
            res.status(500).json({ message: 'Error processing file.' });
        });
});


// API endpoints
app.get('/api/players', (req, res) => res.json(players));
app.get('/api/teams', (req, res) => res.json(teams));

// Socket.IO middleware for authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: Token not provided.'));
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return next(new Error('Authentication error: Invalid token.'));
        socket.user = decoded;
        next();
    });
});

// WebSocket logic
io.on('connection', (socket) => {
    console.log('a user connected:', socket.user.userId);
    socket.emit('auctionState', auctionState);
    socket.emit('currentPlayer', auctionState.currentPlayerIndex !== -1 ? players[auctionState.currentPlayerIndex] : null);

    socket.on('bid', () => {
        if (socket.user.isAdmin) {
             return socket.emit('error', { message: "Admins cannot place bids." });
        }
        const teamId = socket.user.teamId;
        const bidAmount = auctionState.currentBid + 25000;
        const team = teams.find(t => t.id === teamId);

        if (auctionState.isAuctionRunning && team && team.budget >= bidAmount) {
            auctionState.currentBid = bidAmount;
            auctionState.highestBidder = team.name;
            auctionState.timer = 30;
            io.emit('auctionState', auctionState);
        } else {
            socket.emit('error', { message: "Bid rejected. Check budget or auction status." });
        }
    });

    socket.on('startAuction', () => {
        if(socket.user.isAdmin) {
            console.log('Auction started by admin');
            startAuction();
        } else {
            socket.emit('error', { message: "Only admins can start the auction." });
        }
    });

    socket.on('disconnect', () => console.log('user disconnected'));
});

// Auction logic functions (startAuction, nextPlayer, etc.) remain the same
function startAuction() { /* ... */ }
function nextPlayer() { /* ... */ }
function sellPlayer() { /* ... */ }
function endAuction() { /* ... */ }

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
