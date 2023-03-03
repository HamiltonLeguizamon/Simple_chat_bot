const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

// Iniciar el servidor
server.listen(port, () => {
  console.log('Servidor iniciado en el puerto ' + port);
});

// Servir la página HTML
app.use(express.static(__dirname + '/public'));

// Manejar las conexiones de los clientes
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Solicitar el nickname del usuario
  socket.emit('nickname request');

  // Manejar el nickname del usuario
  socket.on('nickname', (nickname) => {
    console.log('Usuario ' + nickname + ' ha ingresado al chat');
    io.emit('joined', nickname);

    // Manejar los mensajes del usuario
    socket.on('chat message', (message) => {
      console.log('Mensaje recibido: ' + message);
      io.emit('chat message', {nickname: nickname, message: message});
    });

    // Manejar la desconexión del usuario
    socket.on('disconnect', () => {
      console.log('Usuario ' + nickname + ' ha salido del chat');
      io.emit('left', nickname);
    });
  });
});
