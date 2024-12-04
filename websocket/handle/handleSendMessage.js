const WebSocket = require("ws");
const Friend = require("../../src/models/Friend");
const Message = require("../../src/models/Message");
const { encrypt, decrypt } = require("../utils/cryptoUtils");

const handleSendMessage = async (data, connectedUsers) => {
  const { senderId, receiverId, message } = data;
  console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

  // Check if users are friends
  const areFriends = await Friend.findOne({
    user_id: senderId,
    friend_id: receiverId,
    status: "accepted",
  });

  if (!areFriends) {
    console.error("Error: Users are not friends");
    return;
  }

  // Encrypt message content
  const encryptedMessage = encrypt(message);

  // Save message to database
  const newMessage = new Message({
    sender: senderId,
    receiver: receiverId,
    content: encryptedMessage,
    seenAt: null, // Message not seen yet
  });
  await newMessage.save();

  // Send message to receiver if online
  const receiverSocket = connectedUsers.get(receiverId);
  if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
    receiverSocket.send(
      JSON.stringify({
        event: "receive_message",
        message: { ...newMessage._doc, content: decrypt(newMessage.content) },
      })
    );
  }
};

module.exports = handleSendMessage;
