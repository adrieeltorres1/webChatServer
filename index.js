const { log } = require('console');
const { Socket } = require('socket.io');


const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}}); 

const PORT = 5001


io.on('connection', socket => {
    console.log('Usuário conectado! Seu ID:', socket.id);

    socket.on('set_username', username => {
        socket.data.username = username; 
        console.log(`Nickname definido para ${username} (ID: ${socket.id})`);
    });

    socket.on('send_message', (data) => {
        const author = socket.data.username || 'Desconhecido';
        
        const messageData = {
            author: author,
            message: data.message, 
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        io.emit('receive_message', messageData); 
    });


    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id);
        
    })
})

server.listen(PORT, () => console.log('Sevidor rodando... ツ'))



