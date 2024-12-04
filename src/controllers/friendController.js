const Friend = require("../models/Friend");

exports.addFriend = async (req, res) => {
  const { friend_id } = req.body;
  try {
    // Vérification des champs requis
    if (!friend_id) {
      return res.status(400).json({ msg: "Please enter all required fields" });
    }

    const friend = new Friend({
      user_id: req.user.id,
      friend_id,
    });
    await friend.save();
    res.json(friend);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ user_id: req.user.id, status: "accepted" });
    res.json(friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getFriendsByUserId = async (req, res) => {
  try {
    const friends = await Friend.find({ user_id: req.params.userId, status: "accepted" });
    if (!friends || friends.length === 0) {
      return res.status(404).json({ msg: "No friends found for this user" });
    }
    res.json(friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteFriend = async (req, res) => {
  try {
    const friend = await Friend.findById(req.params.id);

    if (!friend) {
      return res.status(404).json({ msg: "Friend not found" });
    }

    await Friend.findByIdAndDelete(req.params.id);

    res.json({ msg: "Friend removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteFriendByUserId = async (req, res) => {
  try {
    const friend = await Friend.findOne({
      user_id: req.user.id,
      friend_id: req.params.userId,
    });

    if (!friend) {
      return res.status(404).json({ msg: "Friend not found" });
    }

    await Friend.findByIdAndDelete(friend._id);

    res.json({ msg: "Friend removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const friendRequest = await Friend.findById(req.params.id);

    if (!friendRequest) {
      return res.status(404).json({ msg: "Friend request not found" });
    }

    friendRequest.status = "accepted";
    friendRequest.acceptedAt = new Date();
    await friendRequest.save();

    // Ajouter l'utilisateur à l'origine de la demande en amis automatiquement
    let reverseFriendRequest = await Friend.findOne({
      user_id: req.user.id,
      friend_id: friendRequest.user_id,
    });

    if (!reverseFriendRequest) {
      reverseFriendRequest = new Friend({
        user_id: friendRequest.friend_id,
        friend_id: friendRequest.user_id,
        status: "accepted",
        acceptedAt: new Date(),
      });
      await reverseFriendRequest.save();
    } else {
      reverseFriendRequest.status = "accepted";
      reverseFriendRequest.acceptedAt = new Date();
      await reverseFriendRequest.save();
    }

    res.json({ msg: "Friend request accepted", friendRequest, reverseFriendRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.declineFriendRequest = async (req, res) => {
  try {
    const friendRequest = await Friend.findById(req.params.id);

    if (!friendRequest) {
      return res.status(404).json({ msg: "Friend request not found" });
    }

    friendRequest.status = "declined";
    await friendRequest.save();

    res.json({ msg: "Friend request declined", friendRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};