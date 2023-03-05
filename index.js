const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');

app.use(express.static(__dirname + '/public')); // Configurar carpeta pública

// Escuchar evento 'connection' del socket
io.on('connection', socket => {
	console.log('Nuevo cliente conectado');

	// Escuchar evento 'sendMessage' del socket
	socket.on('sendMessage', message => {
        console.log(`Mensaje recibido: ${message}`);
        // Mostrar animación
        io.emit('showTypingIndicator');
    
        // Esperar 1 segundo antes de enviar la respuesta
        setTimeout(() => {
            const botMessage = getBotMessage();
            io.emit('message', `Bot: ${botMessage}`);
        }, 2000);
    });

	// Escuchar evento 'disconnect' del socket
	socket.on('disconnect', () => {
		console.log('Cliente desconectado');
	});
});

// Generar mensaje aleatorio del bot
function getBotMessage() {
	const botMessages = [
		'Hola, ¿cómo estás?',
		'¿Qué tal tu día?',
		'¿En qué puedo ayudarte?',
		'¿Has escuchado alguna canción buena últimamente?',
		'¿Cuál es tu comida favorita?',
		'¿Qué te gustaría hacer hoy?',
		'¿Has visto alguna película interesante últimamente?'
	];
	const randomIndex = Math.floor(Math.random() * botMessages.length);
	return botMessages[randomIndex];
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Servidor iniciado en puerto ${PORT}`);
});