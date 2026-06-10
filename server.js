const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Game state
let gameState = {
    currentPhotoIndex: 0,
    currentQuestionIndex: 0,
    questionsVisible: false,
    teams: {},
    responses: {}
};

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send current game state to new client
    socket.emit('gameState', gameState);

    // Team registration
    socket.on('registerTeam', (teamName) => {
        gameState.teams[socket.id] = {
            name: teamName,
            score: 0,
            responses: []
        };
        io.emit('teamsUpdate', gameState.teams);
        console.log(`Team registered: ${teamName}`);
    });

    // Handle team response
    socket.on('submitAnswer', (data) => {
        const { photoIndex, questionIndex, answer } = data;
        const key = `${photoIndex}-${questionIndex}`;

        if (!gameState.responses[key]) {
            gameState.responses[key] = {};
        }

        gameState.responses[key][socket.id] = {
            teamName: gameState.teams[socket.id]?.name || 'Unknown',
            answer: answer,
            timestamp: Date.now()
        };

        // Notify admin about new response
        io.emit('responseUpdate', {
            photoIndex,
            questionIndex,
            responses: gameState.responses[key]
        });

        console.log(`Response from ${gameState.teams[socket.id]?.name}: ${answer}`);
    });

    // Presenter controls
    socket.on('updateGameState', (state) => {
        gameState.currentPhotoIndex = state.currentPhotoIndex;
        gameState.currentQuestionIndex = state.currentQuestionIndex;
        gameState.questionsVisible = state.questionsVisible;

        // Broadcast to all clients
        io.emit('gameState', gameState);
    });

    // Reveal correct answer and update scores
    socket.on('revealAnswer', (data) => {
        const { photoIndex, questionIndex, correctAnswer } = data;
        const key = `${photoIndex}-${questionIndex}`;

        if (gameState.responses[key]) {
            Object.keys(gameState.responses[key]).forEach(socketId => {
                const response = gameState.responses[key][socketId];
                if (response.answer === correctAnswer) {
                    if (gameState.teams[socketId]) {
                        gameState.teams[socketId].score += 1;
                    }
                }
            });
        }

        io.emit('teamsUpdate', gameState.teams);
        io.emit('answerRevealed', { photoIndex, questionIndex, correctAnswer });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (gameState.teams[socket.id]) {
            console.log(`Team disconnected: ${gameState.teams[socket.id].name}`);
        }
    });
});

// Start server
server.listen(PORT, () => {
    const localIP = getLocalIP();
    console.log('\n========================================');
    console.log('🎯 Photo Quiz Server Running!');
    console.log('========================================');
    console.log(`\nLocal:    http://localhost:${PORT}`);
    console.log(`Network:  http://${localIP}:${PORT}`);
    console.log('\nURLs:');
    console.log(`  Presenter: http://${localIP}:${PORT}/index.html`);
    console.log(`  Teams:     http://${localIP}:${PORT}/team.html`);
    console.log(`  Admin:     http://${localIP}:${PORT}/admin.html`);
    console.log('\n========================================\n');
});
