const net = require('net');

const server = net.createServer();
const PORT = 5555;
const clients = [];

server.on('connection', (client) => {
  console.log('Client connected');

  client.write('Welcome to the chatroom!\nPlease enter your username: ');

  client.username = null;

  client.on('data', (data) => {
    if (!client.username) {
      client.username = data.toString().trim();
      client.write(`Welcome, ${client.username}!\n`);
    } else {
      const message = `${client.username}: ${data.toString().trim()}`;

      console.log(`Received message from ${client.username}: ${message}`);

      clients.forEach((c) => {
        if (c !== client) {
          c.write(message + '\n');
        }
      });
    }
  });

  client.on('end', () => {
    console.log(`Client ${client.username} disconnected`);
    clients.splice(clients.indexOf(client), 1);

    broadcast(`User ${client.username} has left the chat`);
  });

  clients.push(client);

  broadcast(`User ${client.username} has joined the chat`);
});

function broadcast(message) {
  clients.forEach((client) => {
    client.write(message + '\n');
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});