const express = require('express');
const http = require('node:http');
const helmet = require('helmet');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 10_000
});

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'cloudchat',
    timestamp: new Date().toISOString()
  });
});

const history = [];

io.on('connection', (socket) => {
  socket.emit('history', history);

  socket.on('chat:send', (input) => {
    if (!input || typeof input.text !== 'string') return;

    const text = input.text.trim();
    if (!text || text.length > 500) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      user: 'Guest',
      text,
      time: new Date().toISOString()
    };

    history.push(message);
    if (history.length > 100) history.shift();

    io.emit('chat:message', message);
  });
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  server.listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`CloudChat listening on port ${port}`);
  });
}

module.exports = { app, server };
