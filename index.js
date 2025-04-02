const express = require("express");
const { createServer } = require("http");
const { Server } = require("ws");
const { PeerServer } = require("peer");

const app = express();
const server = createServer(app);
const wss = new Server({ server });

// WebSocket Chat Server
wss.on("connection", (ws) => {
    console.log("New WebSocket Connection");

    ws.on("message", (message) => {
        console.log("Received:", message);

        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client Disconnected");
    });
});

// PeerJS Server for Video Chat
const peerServer = PeerServer({ port: 9000, path: "/" });

peerServer.on("connection", (client) => {
    console.log("New Peer Connected: " + client.id);
});

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
