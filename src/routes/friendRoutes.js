const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addFriend,
  getFriends,
  getFriendsByUserId,
  deleteFriend,
  deleteFriendByUserId,
  acceptFriendRequest,
  declineFriendRequest,
} = require("../controllers/friendController");

router.post("/add", auth, addFriend);
router.get("/", auth, getFriends);
router.get("/user/:userId", auth, getFriendsByUserId);
router.delete("/:id", auth, deleteFriend);
router.delete("/user/:userId", auth, deleteFriendByUserId);
router.put("/accept/:id", auth, acceptFriendRequest);
router.put("/decline/:id", auth, declineFriendRequest);

module.exports = router;