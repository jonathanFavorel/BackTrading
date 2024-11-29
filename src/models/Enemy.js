const mongoose = require('mongoose');

const EnemySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enemy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  blockedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Enemy', EnemySchema);