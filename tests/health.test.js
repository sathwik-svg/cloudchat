const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../server');

test('health endpoint reports healthy', async (t) => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) =>
    server.close((error) => error ? reject(error) : resolve())
  ));

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, 'healthy');
  assert.equal(data.service, 'cloudchat');
});
