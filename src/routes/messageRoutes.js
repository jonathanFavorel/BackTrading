const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  sendMessage,
  getMessages,
  updateMessage,
  markAsSeen,
} = require("../controllers/messageController");

router.post("/send", auth, sendMessage);
router.get("/", auth, getMessages);
router.put("/update", auth, updateMessage);
router.put("/seen", auth, markAsSeen);

module.exports = router;
