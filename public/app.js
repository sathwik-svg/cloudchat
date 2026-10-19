'use strict';

const socket = io();
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');
const emptyState = document.getElementById('empty-state');
const status = document.getElementById('connection-status');
const characterCount = document.getElementById('character-count');

function updateEmptyState() {
  emptyState.style.display = messages.children.length ? 'none' : 'block';
}

function renderMessage(message) {
  if (!message || typeof message.text !== 'string') return;

  const row = document.createElement('article');
  row.className = 'message';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = (message.user || 'G').slice(0, 1).toUpperCase();

  const content = document.createElement('div');
  content.className = 'message-content';

  const heading = document.createElement('div');
  heading.className = 'message-heading';

  const username = document.createElement('strong');
  username.textContent = message.user || 'Guest';

  const time = document.createElement('time');
  const date = new Date(message.time);
  time.dateTime = Number.isNaN(date.getTime()) ? '' : date.toISOString();
  time.textContent = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const text = document.createElement('div');
  text.className = 'message-text';
  text.textContent = message.text;

  heading.append(username, time);
  content.append(heading, text);
  row.append(avatar, content);
  messages.appendChild(row);

  while (messages.children.length > 100) {
    messages.firstElementChild.remove();
  }

  updateEmptyState();
  messages.scrollIntoView({ block: 'end', behavior: 'smooth' });
}

socket.on('connect', () => {
  status.textContent = 'Connected';
});

socket.on('disconnect', () => {
  status.textContent = 'Reconnecting...';
});

socket.on('connect_error', () => {
  status.textContent = 'Connection error';
});

socket.on('history', (history) => {
  messages.replaceChildren();

  if (Array.isArray(history)) {
    history.slice(-100).forEach(renderMessage);
  }

  updateEmptyState();
});

socket.on('chat:message', renderMessage);

input.addEventListener('input', () => {
  characterCount.textContent = `${input.value.length}/500`;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text || text.length > 500 || !socket.connected) return;

  socket.emit('chat:send', { text });
  input.value = '';
  characterCount.textContent = '0/500';
  input.focus();
});

updateEmptyState();
