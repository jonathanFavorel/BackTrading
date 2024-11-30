const mongoose = require("mongoose");

const PropFirmSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logoUrl: { type: String, required: true },
});

module.exports = mongoose.model("PropFirm", PropFirmSchema);
