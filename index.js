require('dotenv').config();
const connectMongo = require('./config/mongodb.js');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const { join } = require('path');
const PORT = 5001;

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: 'http://localhost:5173' } 
});

connectMongo();
app.use(express.json());
app.use('/api/users', require('./routes/usersRoutes'));

io.on('connection', socket => {
    console.log('Usuário conectado! Seu ID:', socket.id);

    socket.on('set_username', username => {
        socket.data.username = username;
        console.log(`Nickname definido para ${username} (ID: ${socket.id})`);
    });

    socket.on('join_room', room => {
        socket.join(room)
    })

    socket.on('send_message', (data) => {
        const author = socket.data.username || 'Desconhecido';

        const messageData = {
            author: author,
            message: data.message,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        io.in(data.room).emit('receive_message', messageData);
        
    });


    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id);

    })
})

server.listen(PORT, () => console.log(`Sevidor UP ツ Rodando na porta: ${PORT}`))