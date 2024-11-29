const mongoose = require('mongoose');

const TradeStatsSchema = new mongoose.Schema({
  trade: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade', required: true },
  symbol: { type: String, required: true },
  totalTrades: { type: Number, default: 0 },
  totalVolume: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalLoss: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
});

module.exports = mongoose.model('TradeStats', TradeStatsSchema);