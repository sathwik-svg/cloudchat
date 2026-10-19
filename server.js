'use strict';

const express = require('express');
const http = require('node:http');
const helmet = require('helmet');
const { Server } = require('socket.io');
const { randomUUID } = require('node:crypto');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 10_000 });
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 })
  : null;

const history = [];
let databaseReady = false;

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));

app.get('/api/health', async (req, res) => {
  try {
    if (pool) {
      await pool.query('SELECT 1');
      return res.json({ status: 'healthy', service: 'cloudchat', database: 'connected', timestamp: new Date().toISOString() });
    }
    res.json({ status: 'healthy', service: 'cloudchat', database: 'not-configured', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'unhealthy', service: 'cloudchat', database: 'disconnected' });
  }
});

async function initializeDatabase() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  databaseReady = true;
}

async function getHistory() {
  if (!pool || !databaseReady) return history.slice(-100);
  const result = await pool.query(
    'SELECT id, username AS "user", message AS text, created_at AS time FROM messages ORDER BY created_at DESC LIMIT 100'
  );
  return result.rows.reverse();
}

io.on('connection', async (socket) => {
  try {
    socket.emit('history', await getHistory());
  } catch (error) {
    console.error('Could not load message history:', error.message);
    socket.emit('history', []);
  }

  socket.on('chat:send', async (input) => {
    if (!input || typeof input.text !== 'string') return;

    const text = input.text.trim();
    if (!text || text.length > 500) return;

    const message = {
      id: randomUUID(),
      user: 'Guest',
      text,
      time: new Date().toISOString()
    };

    try {
      if (pool && databaseReady) {
        const result = await pool.query(
          'INSERT INTO messages (id, username, message, created_at) VALUES ($1, $2, $3, $4) RETURNING created_at AS time',
          [message.id, message.user, message.text, message.time]
        );
        message.time = result.rows[0].time;
      } else {
        history.push(message);
        if (history.length > 100) history.shift();
      }
      io.emit('chat:message', message);
    } catch (error) {
      console.error('Could not save message:', error.message);
      socket.emit('chat:error', { message: 'Message could not be saved. Please try again.' });
    }
  });
});

if (require.main === module) {
  (async () => {
    try {
      await initializeDatabase();
      const port = Number(process.env.PORT) || 3000;
      server.listen(port, process.env.HOST || '0.0.0.0', () => {
        console.log(`CloudChat listening on port ${port}`);
        console.log(`Database: ${pool ? 'PostgreSQL connected' : 'in-memory mode'}`);
      });
    } catch (error) {
      console.error('CloudChat startup failed:', error.message);
      process.exitCode = 1;
      if (pool) await pool.end().catch(() => {});
    }
  })();
}

module.exports = { app, server, initializeDatabase };
