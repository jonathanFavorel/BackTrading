const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nametag: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  onlineStatus: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  privacySettings: {
    showEmail: { type: Boolean, default: true },
    showPhoneNumber: { type: Boolean, default: true },
    showProfilePicture: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model('User', UserSchema);