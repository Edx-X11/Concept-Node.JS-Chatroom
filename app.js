// Import the WebSocket module
const WebSocket = require('ws');

// Define the port for the WebSocket server
const PORT = 5555;

// Create a new WebSocket server instance
const wss = new WebSocket.Server({ port: PORT });

// Function to broadcast messages to all clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Listen for WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send welcome message and request username from client
  ws.send('Welcome to the chatroom!\nPlease enter your username: ');

  // Store the username for the client
  let username = null;

  // Listen for messages from the client
  ws.on('message', (data) => {
    // If username is not set, set it and send welcome message
    if (!username) {
      username = data.trim();
      ws.send(`Welcome, ${username}!\n`);
      broadcast(`User ${username} has joined the chat\n`);
    } else {
      // Broadcast message from client to all other clients
      const message = `${username}: ${data}`;
      broadcast(message);
    }
  });

  // Listen for client disconnection
  ws.on('close', () => {
    console.log(`Client ${username} disconnected`);
    // Broadcast that the user has left the chat
    broadcast(`User ${username} has left the chat\n`);
  });
});

// Log server start
console.log(`WebSocket server running on port ${PORT}`);
