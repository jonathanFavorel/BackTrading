const Message = require("../../src/models/Message");
const WebSocket = require("ws");
const { decrypt } = require("../utils/cryptoUtils");

const handleMarkAsSeen = async (data, ws, connectedUsers) => {
  const { messageId, userId } = data;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return ws.send(
        JSON.stringify({ event: "error", msg: "Message not found" })
      );
    }

    if (message.receiver.toString() !== userId) {
      return ws.send(
        JSON.stringify({
          event: "error",
          msg: "You can only mark your own received messages as seen",
        })
      );
    }

    message.seenAt = new Date();
    await message.save();

    // Notify the sender that the message has been seen
    const senderSocket = connectedUsers.get(message.sender.toString());
    if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
      senderSocket.send(
        JSON.stringify({
          event: "message_seen",
          message: { ...message._doc, content: decrypt(message.content) },
        })
      );
    }

    console.log(`User ${userId} has seen the message: ${messageId}`);

    ws.send(
      JSON.stringify({
        event: "message_seen",
        message: { ...message._doc, content: decrypt(message.content) },
      })
    );
  } catch (err) {
    console.error(err.message);
    ws.send(JSON.stringify({ event: "server_error", msg: "Server error" }));
  }
};

module.exports = handleMarkAsSeen;
