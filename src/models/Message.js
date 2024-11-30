const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  contentType: {
    type: String,
    enum: ["text", "photo", "video", "link", "file"],
    required: true,
  },
  attachmentUrl: { type: String },
  status: {
    type: String,
    enum: ["sent", "not sent", "delivered", "read"],
    default: "not sent",
  },
  seen: { type: Boolean, default: false },
  seenAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
