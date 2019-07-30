const debug = require('debug')('blog-api:server');
const http = require('http');

const app = require('./api/app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  }
});

server.on('listening', () => {
  debug(`Listening on port ${port}`);
});
