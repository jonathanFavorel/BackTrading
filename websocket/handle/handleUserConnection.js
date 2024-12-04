const WebSocket = require("ws");
const User = require("../../src/models/User");
const Message = require("../../src/models/Message");
const { decrypt } = require("../utils/cryptoUtils");

const broadcast = (wss, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const handleUserConnection = async (data, ws, connectedUsers, wss) => {
  console.log(`User connected: ${data.userId}`);
  connectedUsers.set(data.userId, ws);

  // Mettre à jour l'état en ligne de l'utilisateur
  const user = await User.findById(data.userId);
  if (user) {
    user.isOnline = true;
    await user.save();
    console.log(`User ${data.userId} is now online`);
  }

  // Notify user of unread messages
  const unreadMessages = await Message.find({
    receiver: data.userId,
    seenAt: null,
  });

  if (unreadMessages.length > 0) {
    const decryptedMessages = unreadMessages.map((msg) => {
      try {
        return {
          ...msg._doc,
          content: decrypt(msg.content),
        };
      } catch (err) {
        console.error("Failed to decrypt message:", err);
        return {
          ...msg._doc,
          content: "Failed to decrypt message",
        };
      }
    });
    ws.send(
      JSON.stringify({
        event: "unread_messages",
        messages: decryptedMessages,
      })
    );
  }

  broadcast(wss, {
    event: "user_status",
    userId: data.userId,
    status: "online",
  });
};

const handleGetUnreadMessages = async (data, ws) => {
  const { userId } = data;

  // Notify user of unread messages
  const unreadMessages = await Message.find({
    receiver: userId,
    seenAt: null,
  });

  if (unreadMessages.length > 0) {
    const decryptedMessages = unreadMessages.map((msg) => {
      try {
        return {
          ...msg._doc,
          content: decrypt(msg.content),
        };
      } catch (err) {
        console.error("Failed to decrypt message:", err);
        return {
          ...msg._doc,
          content: "Failed to decrypt message",
        };
      }
    });
    ws.send(
      JSON.stringify({
        event: "unread_messages",
        messages: decryptedMessages,
      })
    );
  }
};

module.exports = { handleUserConnection, handleGetUnreadMessages };
