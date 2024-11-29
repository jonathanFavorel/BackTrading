const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiver_id, content, contentType, attachmentUrl } = req.body;
  try {
    // Vérification des champs requis
    if (!receiver_id || !content || !contentType) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    let message = new Message({ sender_id: req.user.id, receiver_id, content, contentType, attachmentUrl });
    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ sender_id: req.user.id }, { receiver_id: req.user.id }] });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};