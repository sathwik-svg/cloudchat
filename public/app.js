const socket = io();
const connection = document.getElementById('connection');
const pulse = document.querySelector('.pulse');
const messages = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('message');
const send = document.getElementById('send');
const notice = document.getElementById('notice');
const empty = document.getElementById('empty');

function setConnection(online) {
  connection.textContent = online ? 'Connected live' : 'Reconnecting…';
  pulse.classList.toggle('online', online);
  send.disabled = !online;
  notice.textContent = online
    ? 'Connected. Messages are live in this room.'
    : 'Messaging server unavailable. Retrying connection…';
}

function renderMessage(message) {
  empty?.remove();
  const article = document.createElement('article');
  article.className = 'message';
  const name = document.createElement('strong');
  name.textContent = message.user || 'Guest';
  const body = document.createElement('p');
  body.textContent = message.text;
  const time = document.createElement('time');
  time.textContent = new Date(message.time).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit'
  });
  article.append(name, body, time);
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
}

socket.on('connect', () => setConnection(true));
socket.on('disconnect', () => setConnection(false));
socket.on('connect_error', () => setConnection(false));
socket.on('history', (items) => items.forEach(renderMessage));
socket.on('chat:message', renderMessage);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || !socket.connected) return;
  socket.emit('chat:send', { text });
  input.value = '';
  input.focus();
});

document.getElementById('theme').addEventListener('click', () => {
  document.body.classList.toggle('light');
});
