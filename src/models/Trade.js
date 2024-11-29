const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  tradingAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TradingAccount' }],
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  takeProfit: { type: Number },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['en cours', 'StopLoss', 'BreakEven', 'TakeProfit'], required: true },
  entryDate: { type: Date, required: true },
  exitDate: { type: Date },
});

module.exports = mongoose.model('Trade', TradeSchema);