const express = require("express");
const { createServer } = require("http");
const { Server } = require("ws");

const app = express();
const server = createServer(app);
const wss = new Server({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket Connection");

  ws.on("message", (message) => {
    console.log("Received:", message);

    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client Disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
