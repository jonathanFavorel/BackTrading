const Message = require("../../src/models/Message");
const WebSocket = require("ws");
const { encrypt, decrypt } = require("../utils/cryptoUtils");

const handleEditMessage = async (data, ws, connectedUsers) => {
  const { messageId, userId, newContent } = data;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return ws.send(
        JSON.stringify({ event: "error", msg: "Message not found" })
      );
    }

    if (message.sender.toString() !== userId) {
      return ws.send(
        JSON.stringify({
          event: "error",
          msg: "You can only edit your own messages",
        })
      );
    }

    // Encrypt new content
    const encryptedContent = encrypt(newContent);

    message.content = encryptedContent;
    message.isEdited = true;
    await message.save();

    // Notify the receiver that the message has been edited
    const receiverSocket = connectedUsers.get(message.receiver.toString());
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
      receiverSocket.send(
        JSON.stringify({
          event: "message_edited",
          message: { ...message._doc, content: decrypt(message.content) },
        })
      );
    }

    console.log(`User ${userId} has edited the message: ${messageId}`);

    ws.send(
      JSON.stringify({
        event: "message_edited",
        message: { ...message._doc, content: decrypt(message.content) },
      })
    );
  } catch (err) {
    console.error(err.message);
    ws.send(JSON.stringify({ event: "server_error", msg: "Server error" }));
  }
};

module.exports = handleEditMessage;
