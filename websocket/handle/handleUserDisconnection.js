const WebSocket = require("ws");
const User = require("../../src/models/User");

const broadcast = (wss, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const handleUserDisconnection = async (ws, connectedUsers, wss) => {
  for (const [userId, socket] of connectedUsers.entries()) {
    if (socket === ws) {
      connectedUsers.delete(userId);

      // Mettre à jour l'état hors ligne de l'utilisateur
      const user = await User.findById(userId);
      if (user) {
        user.isOnline = false;
        await user.save();
      }

      broadcast(wss, { event: "user_status", userId, status: "offline" });
      console.log(`User disconnected: ${userId}`);
      break;
    }
  }
  console.log("Client disconnected");
};

module.exports = handleUserDisconnection;
