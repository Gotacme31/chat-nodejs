const chatForm = document.getElementById('texto-mensaje');
const chatMessages = document.querySelector('.mensajes-enviados');
const roomName = document.getElementById('nombre-sala');
const userList = document.getElementById('users');
const socket = io();

// Tomar nombre de usuario y la sala
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Unir a sala
socket.emit('joinRoom', { username, room });

// Obtener usuarios en la sala
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Mensaje servidor
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Mensaje enviado
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Tomar el texto del mensaje
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  socket.emit('chatMessage', msg);

  // Limpiar el input del mensaje
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
//Funciones en el DOM 
// Imprimir mensaje
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.mensajes-enviados').appendChild(div);
}

// Poner nombre de sala
function outputRoomName(room) {
  roomName.innerText = room;
}

// Usuarios conectados
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Advertencia
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('¿Seguro que quieres salir de esta sala?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
