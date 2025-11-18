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

    //Aqui ele escuta em qual sala o usuário se conecta, essa informação é ultilizada nos demais métodos
    socket.on('join_room', (salaNome) => { 
        socket.rooms.forEach(salaVelha => {
            if (salaVelha !== socket.id) {
                socket.leave(salaVelha);
            }
        });
        socket.join(salaNome);
        console.log(`Usuário ${socket.data.username} saiu das salas antigas e entrou na ${salaNome}`);
    });
   
    //Aqui tá escutando a mensagem que foi enviada, o data é esse objeto "conjunto de informações".
    socket.on('send_message', (data) => {
        const author = socket.data.username || 'Desconhecido';
        const messageData = {
            author: author,
            message: data.message,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        //Aqui me diz para qual sala vai enviar a mensagem, ela sabe qual sala enviar porque já ouviu onde está na linha 30
        io.to(data.room).emit('receive_message', messageData);

    });

    //Aqui escuta se o usuário foi desconectado e e gera um logo informando que o usuário foi desconetaco. 
    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id);
    })
})

server.listen(PORT, () => console.log(`Sevidor UP ツ Rodando na porta: ${PORT}`))