const net = require('net');

const client = net.createConnection({ port: 5555 }, () => {
  console.log('Connected to server');
});

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('Disconnected from server');
});

process.stdin.on('data', (data) => {
  client.write(data);
});