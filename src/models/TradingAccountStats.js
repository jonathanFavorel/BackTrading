const mongoose = require('mongoose');

const TradingAccountStatsSchema = new mongoose.Schema({
  tradingAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'TradingAccount', required: true },
  totalTrades: { type: Number, default: 0 },
  winningTrades: { type: Number, default: 0 },
  losingTrades: { type: Number, default: 0 },
  breakEvenTrades: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalLoss: { type: Number, default: 0 },
  netProfit: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  averageWin: { type: Number, default: 0 },
  averageLoss: { type: Number, default: 0 },
  profitFactor: { type: Number, default: 0 },
  averageTrade: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  mostTradedPairs: [{ symbol: String, count: Number }],
  mostProfitablePairs: [{ symbol: String, profit: Number }],
  leastProfitablePairs: [{ symbol: String, loss: Number }],
});

module.exports = mongoose.model('TradingAccountStats', TradingAccountStatsSchema);