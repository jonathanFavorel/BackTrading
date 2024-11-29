const mongoose = require('mongoose');

const TradingAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, required: true },
  leverage: { type: Number, required: true },
  isPropFirm: { type: Boolean, required: true },
  propFirm: { type: mongoose.Schema.Types.ObjectId, ref: 'PropFirm' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TradingAccount', TradingAccountSchema);