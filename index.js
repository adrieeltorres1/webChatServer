require('dotenv').config();
const connectMongo = require('./config/mongodb.js');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
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

let onlineUsers = []; 

io.on('connection', socket => {
    console.log('Usuário conectado! ID:', socket.id);

    socket.on('set_username', username => {
        socket.data.username = username;
    });

    socket.on('join_room', (salaNome) => {
        socket.rooms.forEach(salaVelha => {
            if (salaVelha !== socket.id) {
                socket.leave(salaVelha);
            }
        });

        socket.join(salaNome);
        console.log(`Usuário ${socket.data.username} entrou em: ${salaNome}`);

        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        
        if (socket.data.username) {
            onlineUsers.push({
                socketId: socket.id,
                username: socket.data.username,
                room: salaNome
            });
        }

        const usersInThisRoom = onlineUsers.filter(user => user.room === salaNome);
        io.to(salaNome).emit('room_users', usersInThisRoom);
    });

    socket.on('send_message', (data) => {
        const author = socket.data.username || 'Desconhecido';
        const messageData = {
            author: author,
            message: data.message,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isPrivate: false 
        };
        io.to(data.room).emit('receive_message', messageData);
    });

    socket.on('send_private_message', (data) => {
        const { targetSocketId, message, targetName } = data;
        const privateMsg = {
            author: `${socket.data.username} (Sussurro)`,
            message: message,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isPrivate: true
        };
        io.to(targetSocketId).emit('receive_message', privateMsg);
        const myCopy = { ...privateMsg, author: `Para ${targetName} (Sussurro)` };
        socket.emit('receive_message', myCopy);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado!', socket.id);
        
        const user = onlineUsers.find(u => u.socketId === socket.id);
        
        if (user) {
            onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
            
            const usersInThisRoom = onlineUsers.filter(u => u.room === user.room);
            io.to(user.room).emit('room_users', usersInThisRoom);
        }
    });
})

server.listen(PORT, () => console.log(`Sevidor UP ツ Rodando na porta: ${PORT}`))