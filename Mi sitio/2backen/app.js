const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const playersFile = path.join(__dirname, '../data/players.json');
const matchesFile = path.join(__dirname, '../data/matches.json');

// Leer o escribir datos
const loadData = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const saveData = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Login de jugadores
app.post('/api/login', (req, res) => {
    const { username } = req.body;
    const players = loadData(playersFile);
    if (!players[username]) players[username] = { mmr: 0 };
    saveData(playersFile, players);
    res.json({ mmr: players[username].mmr });
});

// Chat
app.post('/api/chat', (req, res) => {
    const { username, message } = req.body;
    console.log(`[CHAT] ${username}: ${message}`);
    res.json({ success: true });
});

// Salas
app.post('/api/join-room/:room', (req, res) => {
    const { username } = req.body;
    const room = req.params.room;
    const matches = loadData(matchesFile);
    matches[room].push(username);
    saveData(matchesFile, matches);
    res.json({ success: true });
});

// Iniciar servidor
app.listen(3000, () => console.log('Backend corriendo en http://localhost:3000'));
