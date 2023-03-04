const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8000;

// Iniciar el servidor
server.listen(port, () => {
  console.log('Servidor iniciado en el puerto ' + port);
});

// Servir la página HTML
app.use(express.static(__dirname + '/public'));

// Mantener un registro de los IDs de los clientes que han enviado mensajes
let clientes_conectados = new Set();
let clientes_mensajes_enviados = new Set();

// Manejar las conexiones de los clientes
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Solicitar el nickname del usuario
  socket.emit('nickname request');

    //Se añade el cliente a la lista de clientes conectados
    clientes_conectados.add(socket.id);

    // Manejar el nickname del usuario
    socket.on('nickname', (nickname) => {
        console.log('Usuario ' + nickname + ' ha ingresado al chat');
        io.emit('joined', nickname);
        
        // Manejar los mensajes del usuario
        socket.on('chat message', (message) => {
            
            if (clientes_mensajes_enviados.has(socket.id)) { // Si este cliente ya envió un mensaje
                console.log('El usuario ' + nickname + ' ya envió un mensaje');
                //Muestra clientes conectados
                console.log('Clientes conectados: ' + clientes_conectados.size);
                //Muestra clientes que enviaron mensajes
                console.log('Clientes que enviaron mensajes: ' + clientes_mensajes_enviados.size);
                return;
            }else{
                console.log(nickname + ': ' + message);
                io.emit('chat message', {nickname: nickname, message: message});
                clientes_mensajes_enviados.add(socket.id); // Se añade el cliente a la lista de clientes que enviaron mensajes
                
                // Si todos los clientes enviaron un mensaje, se reinicia la lista de clientes que enviaron mensajes
                if (clientes_conectados.size == clientes_mensajes_enviados.size) {
                    clientes_mensajes_enviados.clear();
                }
            }
          
        });

        // Manejar la desconexión del usuario
        socket.on('disconnect', () => {
            console.log('Usuario ' + nickname + ' ha salido del chat');
            io.emit('left', nickname);
            clientes_conectados.delete(socket.id); // Se elimina el cliente de la lista de clientes conectados
        });
    });
});
