const socket = io();

// Solicitar el nickname del usuario
socket.on('nickname request', () => {
	const nickname = prompt('Ingresa tu nickname:');
	socket.emit('nickname', nickname);
});

// Manejar los mensajes del usuario
document.getElementById('message-form').addEventListener('submit', (event) => {
	event.preventDefault();
	const messageInput = document.getElementById('message-input');
	const message = messageInput.value;
	messageInput.value = '';
	socket.emit('chat message', message);
});

// Mostrar los mensajes recibidos
socket.on('chat message', (data) => {
	const messagesContainer = document.getElementById('messages-container');
	const messageElement = document.createElement('div');
	messageElement.innerText = `${data.nickname}: ${data.message}`;
	messagesContainer.appendChild(messageElement);
});

// Mostrar cuando un usuario se une al chat
socket.on('joined', (nickname) => {
	const messagesContainer = document.getElementById('messages-container');
	const messageElement = document.createElement('div');
	messageElement.innerText = `${nickname} se ha unido al chat`;
	messagesContainer.appendChild(messageElement);
});

// Mostrar cuando un usuario deja el chat
socket.on('left', (nickname) => {
	const messagesContainer = document.getElementById('messages-container');
	const messageElement = document.createElement('div');
	messageElement.innerText = `${nickname} ha dejado el chat`;
	messagesContainer.appendChild(messageElement);
});
