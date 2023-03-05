const socket = io();

// Seleccionar elementos del DOM
const messageForm = document.querySelector('#message-form');
const messageInput = messageForm.querySelector('input[name="message"]');
const messages = document.querySelector('#messages');
const typingIndicator = document.querySelector('#typing-indicator');


// Escuchar evento 'connect' del socket
socket.on('connect', () => {
	console.log('Conectado al servidor');
});

// Escuchar evento 'disconnect' del socket
socket.on('disconnect', () => {
	console.log('Desconectado del servidor');
});

// Escuchar evento 'message' del socket
socket.on('message', message => {
    console.log(message);
    // Ocultar animación
    typingIndicator.classList.remove('visible');
    addMessage(message);
});

// Agregar mensaje a la interfaz de usuario
function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
}

// Escuchar evento 'submit' del formulario
messageForm.addEventListener('submit', event => {
	event.preventDefault();
	const message = messageInput.value;
	addMessage(`Tú: ${message}`);
	socket.emit('sendMessage', message);
	messageInput.value = '';
	messageInput.focus();
});

socket.on('showTypingIndicator', () => {
    // Mostrar animación
    typingIndicator.classList.add('visible');
});