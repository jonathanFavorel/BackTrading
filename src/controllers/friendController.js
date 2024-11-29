const Friend = require('../models/Friend');

exports.addFriend = async (req, res) => {
  const { friend_id } = req.body;
  try {
    // Vérification des champs requis
    if (!friend_id) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const friend = new Friend({
      user_id: req.user.id,
      friend_id,
      status: 'pending',
    });
    await friend.save();
    res.json(friend);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ user_id: req.user.id });
    res.json(friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};