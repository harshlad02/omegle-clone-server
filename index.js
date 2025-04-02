const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let waitingUser = null; // Stores a user waiting for a chat
let activePairs = new Map(); // Stores active chat pairs

wss.on("connection", (ws) => {
    console.log("New user connected");

    if (waitingUser) {
        // Pair the waiting user with the new one
        activePairs.set(ws, waitingUser);
        activePairs.set(waitingUser, ws);

        waitingUser.send("Connected to a stranger!");
        ws.send("Connected to a stranger!");

        waitingUser = null;
    } else {
        // No one is waiting, so store this user
        waitingUser = ws;
        ws.send("Waiting for a stranger...");
    }

    ws.on("message", (message) => {
        const partner = activePairs.get(ws);
        if (partner) {
            partner.send(message); // Send message to paired user
        }
    });

    ws.on("close", () => {
        console.log("User disconnected");

        const partner = activePairs.get(ws);
        if (partner) {
            partner.send("Stranger has disconnected.");
            activePairs.delete(partner);
        }

        activePairs.delete(ws);

        if (waitingUser === ws) {
            waitingUser = null;
        }
    });
});

console.log("WebSocket server running on port 8080");
