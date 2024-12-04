const Message = require("../models/Message");
const Friend = require("../models/Friend");

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  try {
    // Vérifier si les utilisateurs sont amis
    const areFriends = await Friend.findOne({
      user_id: senderId,
      friend_id: receiverId,
      status: "accepted",
    });

    if (!areFriends) {
      return res
        .status(400)
        .json({ msg: "You can only send messages to friends." });
    }

    // Enregistrer le message dans la base de données
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateMessage = async (req, res) => {
  const { messageId, content } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You can only edit your own messages" });
    }

    message.content = content;
    message.updatedAt = new Date();
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.markAsSeen = async (req, res) => {
  const { messageId } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (message.receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You can only mark your own received messages as seen" });
    }

    message.seenAt = new Date();
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
