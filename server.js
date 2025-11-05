const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  global.io = io;

  server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });
});
