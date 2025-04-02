const express = require("express");
const { createServer } = require("http");
const { Server } = require("ws");
const { ExpressPeerServer } = require("peer");

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

// PeerJS Server for Video Chat (Runs on Same Express Server)
const peerServer = ExpressPeerServer(server, { path: "/" });
app.use("/peerjs", peerServer);

peerServer.on("connection", (client) => {
    console.log("New Peer Connected: " + client.id);
});

// Start Server (Using Single Port for Render)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
